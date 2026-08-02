'use strict'

const test = require('tape')
const fastURI = require('..')

test('parse preserves reserved path escapes as data', (t) => {
  const components = fastURI.parse('http://example.com/a%2Fb/public/%2e%2e/admin')

  t.equal(components.path, '/a%2Fb/public/%2E%2E/admin')
  t.end()
})

test('normalize preserves percent-encoded path separators and dot segments', (t) => {
  t.equal(
    fastURI.normalize('http://example.com/public/%2e%2e/admin'),
    'http://example.com/public/%2E%2E/admin'
  )

  t.equal(
    fastURI.normalize('http://example.com/a%2Fb'),
    'http://example.com/a%2Fb'
  )

  t.end()
})

test('equal does not treat reserved path escapes as live path syntax', (t) => {
  t.equal(
    fastURI.equal('http://example.com/public/%2e%2e/admin', 'http://example.com/admin', {}),
    false
  )

  t.equal(
    fastURI.equal('http://example.com/a%2Fb', 'http://example.com/a/b', {}),
    false
  )

  t.end()
})

test('resolve does not escape the base prefix through encoded dot segments', (t) => {
  t.equal(
    fastURI.resolve('http://example.com/public/index.html', '%2e%2e/admin'),
    'http://example.com/public/%2E%2E/admin'
  )

  t.equal(
    fastURI.resolve('http://example.com/public/index.html', '%2e%2e%2fadmin'),
    'http://example.com/public/%2E%2E%2Fadmin'
  )

  t.equal(
    fastURI.resolve('http://example.com/public/', 'a%2Fb'),
    'http://example.com/public/a%2Fb'
  )

  t.end()
})

test('normalize keeps encoded escapes intact instead of double escaping them', (t) => {
  // %25 is an escaped percent sign and must survive a normalize round-trip
  t.equal(
    fastURI.normalize('http://example.com/a%25b'),
    'http://example.com/a%25b'
  )

  // unreserved characters are still decoded, and escapes are upper-cased
  t.equal(
    fastURI.normalize('http://example.com/%63%2fd'),
    'http://example.com/c%2Fd'
  )

  t.end()
})
