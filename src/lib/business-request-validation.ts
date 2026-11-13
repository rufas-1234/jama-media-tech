export type BusinessRequestType = 'enquiry' | 'quotation';

export type BusinessRequestDraft = {
  type: BusinessRequestType;
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  category: string;
  requirements: string;
  scope: string;
  deliveryLocation: string;
  consent: boolean;
  website: string;
};

export type BusinessRequestUpdate = {
  status: 'new' | 'reviewing' | 'quoted' | 'closed';
  internalNotes: string;
  responseMessage: string;
  quoteAmount: number | null;
  quoteCurrency: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateBusinessRequest(value: unknown):
  | { request: BusinessRequestDraft }
  | { error: string } {
  if (!isRecord(value)) return { error: 'Request data must be an object.' };
  if (value.type !== 'enquiry' && value.type !== 'quotation') return { error: 'Choose a valid request type.' };
  if (text(value.website)) return { error: 'Request could not be submitted.' };

  const fullName = text(value.fullName);
  const organization = text(value.organization);
  const email = text(value.email).toLowerCase();
  const phone = text(value.phone);
  const country = text(value.country);
  const subject = text(value.subject);
  const category = text(value.category);
  const requirements = text(value.requirements);
  const scope = text(value.scope);
  const deliveryLocation = text(value.deliveryLocation);

  if (fullName.length < 2 || fullName.length > 120) return { error: 'Name must be between 2 and 120 characters.' };
  if (organization.length > 160) return { error: 'Organisation must be 160 characters or fewer.' };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  if (phone.length > 60) return { error: 'Telephone must be 60 characters or fewer.' };
  if (country.length > 120) return { error: 'Country must be 120 characters or fewer.' };
  if (subject.length < 3 || subject.length > 180) return { error: 'Subject must be between 3 and 180 characters.' };
  if (category.length < 2 || category.length > 120) return { error: 'Choose a valid category.' };
  if (requirements.length < 10 || requirements.length > 5000) return { error: 'Please describe your requirements in 10 to 5,000 characters.' };
  if (scope.length > 500) return { error: 'Scope must be 500 characters or fewer.' };
  if (deliveryLocation.length > 160) return { error: 'Delivery location must be 160 characters or fewer.' };
  if (value.consent !== true) return { error: 'Consent is required before submitting this request.' };

  return {
    request: {
      type: value.type,
      fullName,
      organization,
      email,
      phone,
      country,
      subject,
      category,
      requirements,
      scope,
      deliveryLocation,
      consent: true,
      website: '',
    },
  };
}

const requestStatuses = ['new', 'reviewing', 'quoted', 'closed'] as const;

export function validateBusinessRequestUpdate(value: unknown):
  | { update: BusinessRequestUpdate }
  | { error: string } {
  if (!isRecord(value)) return { error: 'Request update must be an object.' };
  if (!requestStatuses.includes(value.status as (typeof requestStatuses)[number])) return { error: 'Choose a valid request status.' };

  const internalNotes = text(value.internalNotes);
  const responseMessage = text(value.responseMessage);
  const quoteCurrency = text(value.quoteCurrency).toUpperCase();
  const quoteAmountValue = value.quoteAmount;
  if (quoteAmountValue !== null && quoteAmountValue !== '' && typeof quoteAmountValue !== 'number' && typeof quoteAmountValue !== 'string') {
    return { error: 'Quote amount must be a number.' };
  }
  const quoteAmount = quoteAmountValue === null || quoteAmountValue === '' ? null : Number(quoteAmountValue);

  if (internalNotes.length > 5000) return { error: 'Internal notes must be 5,000 characters or fewer.' };
  if (responseMessage.length > 5000) return { error: 'Response message must be 5,000 characters or fewer.' };
  if (quoteAmount !== null && (!Number.isFinite(quoteAmount) || quoteAmount < 0 || quoteAmount > 1_000_000_000 || Math.round(quoteAmount * 100) !== quoteAmount * 100)) {
    return { error: 'Quote amount must be a non-negative amount with up to two decimal places.' };
  }
  if (quoteCurrency && !/^[A-Z]{3}$/.test(quoteCurrency)) return { error: 'Currency must be a three-letter code such as USD.' };
  if (value.status === 'quoted' && !responseMessage && quoteAmount === null) return { error: 'Add a response or quote amount before marking this request as quoted.' };

  return {
    update: {
      status: value.status as BusinessRequestUpdate['status'],
      internalNotes,
      responseMessage,
      quoteAmount,
      quoteCurrency: quoteAmount === null ? '' : quoteCurrency || 'USD',
    },
  };
}
