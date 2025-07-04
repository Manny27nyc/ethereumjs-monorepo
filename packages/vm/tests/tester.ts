// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { exit } from 'process'
import tape from 'tape'
import Common from '@ethereumjs/common'
import stateTestsRunner from './GeneralStateTestsRunner'
import blockchainTestsRunner from './BlockchainTestsRunner'
import * as config from './config'

const argv = require('minimist')(process.argv.slice(2))

const testLoader = require('./testLoader')

/**
 * Test runner
 * CLI arguments:
 * --state: run state tests
 * --blockchain: run blockchain tests
 * --fork: fork to use for these tests
 * --skip: comma seperated list of tests to skip. choices of: all,broken,permanent,slow. Defaults to all
 * --runSkipped: comma seperated list of tests to skip if --skip is not set. choices of: all,broken,permanent,slow. Defaults to none
 * --file: test file to run
 * --test: test name to run
 * --dir: test directory to look for tests
 * --excludeDir: test directory to exlude from testing
 * --testsPath: root directory of tests to look
 * --customStateTest: run a file with a custom state test (not in test directory)
 * --jsontrace: enable json step tracing in state tests
 * --dist: use the compiled version of the VM
 * --data: only run this state test if the transaction has this calldata
 * --gas: only run this state test if the transaction has this gasLimit
 * --value: only run this state test if the transaction has this call value
 * --debug: enable BlockchainTests debugger (compares post state against the expected post state)
 * --expected-test-amount: (optional) if present, check after tests are ran if at least this amount of tests have passed (inclusive)
 * --verify-test-amount-alltests: if this is passed, get the expected amount from tests and verify afterwards if this is the count of tests (expects tests are ran with default settings)
 */

async function runTests() {
  let name: string
  let runner: any
  if (argv.state) {
    name = 'GeneralStateTests'
    runner = stateTestsRunner
  } else if (argv.blockchain) {
    name = 'BlockchainTests'
    runner = blockchainTestsRunner
  } else {
    console.log(`Test type not supported or provided`)
    exit(1)
  }

  const FORK_CONFIG: string = argv.fork || config.DEFAULT_FORK_CONFIG
  const FORK_CONFIG_TEST_SUITE = config.getRequiredForkConfigAlias(FORK_CONFIG)

  // Examples: Istanbul -> istanbul, MuirGlacier -> muirGlacier
  const FORK_CONFIG_VM = FORK_CONFIG.charAt(0).toLowerCase() + FORK_CONFIG.substring(1)

  /**
   * Configuration for getting the tests from the ethereum/tests repository
   */
  const testGetterArgs: any = {}
  testGetterArgs.skipTests = config.getSkipTests(argv.skip, argv.runSkipped ? 'NONE' : 'ALL')
  testGetterArgs.runSkipped = config.getSkipTests(argv.runSkipped, 'NONE')
  testGetterArgs.forkConfig = FORK_CONFIG_TEST_SUITE
  testGetterArgs.file = argv.file
  testGetterArgs.test = argv.test
  testGetterArgs.dir = argv.dir
  testGetterArgs.excludeDir = argv.excludeDir
  testGetterArgs.testsPath = argv.testsPath
  testGetterArgs.customStateTest = argv.customStateTest

  /**
   * Run-time configuration
   */
  const runnerArgs: any = {}
  runnerArgs.forkConfigVM = FORK_CONFIG_VM
  runnerArgs.forkConfigTestSuite = FORK_CONFIG_TEST_SUITE
  runnerArgs.common = config.getCommon(FORK_CONFIG_VM)
  runnerArgs.jsontrace = argv.jsontrace
  runnerArgs.dist = argv.dist
  runnerArgs.data = argv.data // GeneralStateTests
  runnerArgs.gasLimit = argv.gas // GeneralStateTests
  runnerArgs.value = argv.value // GeneralStateTests
  runnerArgs.debug = argv.debug // BlockchainTests

  let expectedTests: number | undefined
  if (argv['verify-test-amount-alltests']) {
    expectedTests = config.getExpectedTests(FORK_CONFIG_VM, name)
  } else if (argv['expected-test-amount']) {
    expectedTests = argv['expected-test-amount']
  }

  /**
   * Initialization output to console
   */
  const width = 50
  const fillWidth = width
  const fillParam = 20
  const delimiter = `| `.padEnd(fillWidth) + ' |'
  const formatArgs = (args: any) => {
    return Object.assign(
      {},
      ...Object.entries(args)
        .filter(([_k, v]) => v && (v as any).length !== 0)
        .map(([k, v]) => ({
          [k]: typeof v !== 'string' && (v as any).length ? (v as any).length : v,
        }))
    )
  }
  const formattedGetterArgs = formatArgs(testGetterArgs)
  const formattedRunnerArgs = formatArgs(runnerArgs)

  console.log(`+${'-'.repeat(width)}+`)
  console.log(`| VM -> ${name} `.padEnd(fillWidth) + ' |')
  console.log(delimiter)
  console.log(`| TestGetterArgs`.padEnd(fillWidth) + ' |')
  for (const [key, value] of Object.entries(formattedGetterArgs)) {
    console.log(`| ${key.padEnd(fillParam)}: ${value}`.padEnd(fillWidth) + ' |')
  }
  console.log(delimiter)
  console.log(`| RunnerArgs`.padEnd(fillWidth) + ' |')
  for (const [key, value] of Object.entries(formattedRunnerArgs)) {
    if (key == 'common') {
      const hf = (value as Common).hardfork()
      console.log(`| ${key.padEnd(fillParam)}: ${hf}`.padEnd(fillWidth) + ' |')
    } else {
      console.log(`| ${key.padEnd(fillParam)}: ${value}`.padEnd(fillWidth) + ' |')
    }
  }
  console.log(`+${'-'.repeat(width)}+`)
  console.log()

  if (argv.customStateTest) {
    const fileName = argv.customStateTest
    tape(name, (t) => {
      testLoader.getTestFromSource(fileName, async (err: string | undefined, test: any) => {
        if (err) {
          return t.fail(err)
        }
        t.comment(`file: ${fileName} test: ${test.testName}`)
        await stateTestsRunner(runnerArgs, test, t)
        t.end()
      })
    })
  } else {
    tape(name, async (t) => {
      let testIdentifier: string
      const failingTests: any = {}

      ;(t as any).on('result', (o: any) => {
        if (o.ok != undefined && !o.ok) {
          if (failingTests[testIdentifier]) {
            failingTests[testIdentifier].push(o.name)
          } else {
            failingTests[testIdentifier] = [o.name]
          }
        }
      })
      // Tests for HFs before Istanbul have been moved under `LegacyTests/Constantinople`:
      // https://github.com/ethereum/tests/releases/tag/v7.0.0-beta.1

      const dirs = config.getTestDirs(FORK_CONFIG_VM, name)
      for (const dir of dirs) {
        await new Promise<void>((resolve, reject) => {
          testLoader
            .getTestsFromArgs(
              dir,
              async (fileName: string, testName: string, test: any) => {
                const runSkipped = testGetterArgs.runSkipped
                const inRunSkipped = runSkipped.includes(fileName)
                if (runSkipped.length === 0 || inRunSkipped) {
                  testIdentifier = `file: ${fileName} test: ${testName}`
                  t.comment(testIdentifier)
                  await runner(runnerArgs, test, t)
                }
              },
              testGetterArgs
            )
            .then(() => {
              resolve()
            })
            .catch((error: string) => {
              t.fail(error)
              reject()
            })
        })
      }

      for (const failingTestIdentifier in failingTests) {
        console.log('Errors thrown in ' + failingTestIdentifier + ':')
        const errors = failingTests[failingTestIdentifier]
        for (let i = 0; i < errors.length; i++) {
          console.log('\t' + <string>errors[i])
        }
      }

      if (expectedTests != undefined) {
        t.ok(
          (t as any).assertCount >= expectedTests,
          'expected ' + expectedTests.toString() + ' checks, got ' + <string>(t as any).assertCount
        )
      }

      t.end()
    })
  }
}

runTests() // eslint-disable-line @typescript-eslint/no-floating-promises
