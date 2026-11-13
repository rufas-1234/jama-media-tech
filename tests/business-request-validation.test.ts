import assert from 'node:assert/strict';
import test from 'node:test';
import { validateBusinessRequest, validateBusinessRequestUpdate } from '../src/lib/business-request-validation.ts';

const validEnquiry = {
  type: 'enquiry',
  fullName: 'Ada User',
  organization: 'Example Organisation',
  email: ' ADA@EXAMPLE.COM ',
  phone: '+211 555 0100',
  country: '',
  subject: 'Supply partnership',
  category: 'Partnership',
  requirements: 'We would like to discuss a supply partnership.',
  scope: '',
  deliveryLocation: '',
  consent: true,
  website: '',
};

function getError(result: { error: string } | { request: unknown } | { update: unknown }) {
  assert.ok('error' in result);
  return 'error' in result ? result.error : '';
}

test('validates and normalizes a customer enquiry', () => {
  const result = validateBusinessRequest(validEnquiry);
  assert.ok('request' in result);
  if ('request' in result) {
    assert.equal(result.request.email, 'ada@example.com');
    assert.equal(result.request.fullName, 'Ada User');
    assert.equal(result.request.type, 'enquiry');
  }
});

test('rejects missing consent and honeypot submissions', () => {
  assert.match(getError(validateBusinessRequest({ ...validEnquiry, consent: false })), /Consent is required/);
  assert.match(getError(validateBusinessRequest({ ...validEnquiry, website: 'bot-filled-value' })), /could not be submitted/);
});

test('requires a valid email address and useful request details', () => {
  assert.match(getError(validateBusinessRequest({ ...validEnquiry, email: 'not-an-email' })), /valid email/);
  assert.match(getError(validateBusinessRequest({ ...validEnquiry, requirements: 'Short' })), /10 to 5,000/);
});

test('requires quote details before a request can be marked quoted', () => {
  assert.match(getError(validateBusinessRequestUpdate({
    status: 'quoted',
    internalNotes: '',
    responseMessage: '',
    quoteAmount: null,
    quoteCurrency: 'USD',
  })), /Add a response or quote amount/);

  const result = validateBusinessRequestUpdate({
    status: 'quoted',
    internalNotes: '',
    responseMessage: 'Please see our proposed scope.',
    quoteAmount: '125.50',
    quoteCurrency: 'usd',
  });
  assert.ok('update' in result);
  if ('update' in result) {
    assert.equal(result.update.quoteAmount, 125.5);
    assert.equal(result.update.quoteCurrency, 'USD');
  }
});
