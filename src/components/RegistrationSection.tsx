import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { RegistrationFormData } from '../types';
import {
  BUSINESS_CATEGORIES,
  PARTICIPANT_CATEGORIES,
  CONSENT_TEXT,
} from '../data/registration';
import { registrationConfigured } from '../lib/supabase';
import {
  submitRegistration,
  validateRegistration,
} from '../lib/registration';
import { Turnstile } from './Turnstile';

const empty: RegistrationFormData = {
  fullName: '',
  email: '',
  whatsapp: '+234',
  countryResidence: '',
  category: '',
  companyName: '',
  discovery: '',
  consentRequired: false,
  website: '',
};

type TextField =
  | 'fullName'
  | 'email'
  | 'whatsapp'
  | 'countryResidence'
  | 'companyName'
  | 'discovery';

export function RegistrationSection({
  preselectedCategory,
}: {
  preselectedCategory: string;
}) {
  const [form, setForm] = useState<RegistrationFormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState('');
  const [token, setToken] = useState('');
  const [reset, setReset] = useState(0);

  const locked = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onToken = useCallback((value: string) => {
    setToken(value);
  }, []);

  useEffect(() => {
    if (preselectedCategory) {
      setForm(previous => ({
        ...previous,
        category: preselectedCategory,
      }));
    }
  }, [preselectedCategory]);

  useEffect(() => {
    if (success) {
      successHeading.current?.focus();
    }
  }, [success]);

  const field = (
    key: keyof RegistrationFormData,
    value: string | boolean,
  ) => {
    setForm(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  };

  const showCompany = BUSINESS_CATEGORIES.includes(form.category);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (locked.current) return;

    const found = validateRegistration(form);
    setErrors(found);
    setFailure('');

    if (Object.keys(found).length) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    if (!registrationConfigured) {
      setFailure('Registration is not open yet. Please check back soon.');
      return;
    }

    if (!token) {
      setFailure('Please complete the verification check before submitting.');
      return;
    }

    locked.current = true;
    setPending(true);

    try {
      await submitRegistration(form, token);
      setSuccess(true);
      setForm(empty);
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : 'Please try again shortly.',
      );
    } finally {
      locked.current = false;
      setPending(false);
      setToken('');
      setReset(previous => previous + 1);
    }
  };

  const input = (
    key: TextField,
    label: string,
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
  ) => {
    const maxLength =
      key === 'email'
        ? 254
        : key === 'fullName'
          ? 120
          : key === 'whatsapp'
            ? 30
            : key === 'countryResidence'
              ? 100
              : 160;

    return (
      <div>
        <label
          htmlFor={key}
          className="block text-sm font-semibold mb-2"
        >
          {label}
          {key === 'discovery' && (
            <span className="font-normal text-[#4A5B53]">
              {' '}(optional)
            </span>
          )}
        </label>

        <input
          id={key}
          name={key}
          type={type}
          value={form[key]}
          required={key !== 'discovery'}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="field"
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          onChange={event => field(key, event.target.value)}
        />

        {errors[key] && (
          <p
            id={`${key}-error`}
            className="text-xs text-red-700 mt-2"
          >
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section
      id="register"
      aria-labelledby="registration-heading"
      className="py-16 lg:py-20 px-6 lg:px-12 bg-[#0F3324] text-white relative overflow-hidden bg-cover bg-center bg-no-repeat scroll-mt-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 51, 36, 0.85), rgba(10, 36, 25, 0.90)), url('/images/seminar-background.jpg')",
      }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 relative">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-widest font-bold text-[#7BCB88] mb-5">
            Free online seminar
          </p>

          <h2
            id="registration-heading"
            className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-[1.12] mb-6"
          >
            Your next opportunity starts with a connection.
          </h2>

          <p className="text-lg font-light text-white/80 leading-relaxed mb-7">
            Register your interest in the HyreMoto affiliate seminar.
            We’ll share the date and access details once confirmed.
          </p>

          <div className="flex gap-3 items-center text-sm text-white/85">
            <CheckCircle2
              className="text-[#7BCB88] shrink-0"
              size={19}
            />
            <span>Date and time to be announced</span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed mt-7 max-w-sm">
            Seminar registration does not guarantee affiliate approval.
          </p>
        </div>

        <div className="lg:col-span-7 bg-white text-[#172822] p-6 sm:p-9 rounded-3xl border border-[#172822]/10 shadow-xl">
          {success ? (
            <div className="py-10" role="status">
              <CheckCircle2
                size={42}
                className="text-[#0F3324] mb-6"
              />

              <h3
                tabIndex={-1}
                ref={successHeading}
                className="font-display text-3xl font-bold mb-4"
              >
                You’re on the list.
              </h3>

              <p className="text-[#4A5B53] leading-relaxed">
                Your interest has been registered. The seminar date and
                access details will be shared once confirmed.
              </p>

              <button
                type="button"
                className="mt-8 underline text-sm font-bold"
                onClick={() => {
                  setSuccess(false);
                  setErrors({});
                  setFailure('');
                }}
              >
                Register another attendee
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-display font-bold mb-2">
                Register your interest
              </h3>

              <p className="text-sm text-[#4A5B53] mb-7">
                Be notified when the seminar details are announced.
              </p>

              {!registrationConfigured && (
                <p
                  className="text-sm border border-[#172822]/10 rounded-xl p-4 mb-6"
                  role="status"
                >
                  Registration opens soon. Please check back shortly.
                </p>
              )}

              <form
                ref={formRef}
                onSubmit={submit}
                noValidate
                className="space-y-5"
                aria-busy={pending}
              >
                <fieldset disabled={pending} className="space-y-5">
                  <legend className="sr-only">
                    Attendee details
                  </legend>

                  {input(
                    'fullName',
                    'Full name',
                    'text',
                    'Your full name',
                    'name',
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    {input(
                      'email',
                      'Email address',
                      'email',
                      'you@example.com',
                      'email',
                    )}

                    {input(
                      'whatsapp',
                      'WhatsApp number',
                      'tel',
                      '+2348141234567',
                      'tel',
                    )}
                  </div>

                  <p className="text-xs text-[#4A5B53]">
                    Include your country code, e.g. +2348141234567.
                  </p>

                  {input(
                    'countryResidence',
                    'Country of residence',
                    'text',
                    'e.g. Nigeria',
                    'country-name',
                  )}

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold mb-2"
                    >
                      Participant category
                    </label>

                    <select
                      id="category"
                      name="category"
                      className="field"
                      value={form.category}
                      required
                      aria-invalid={!!errors.category}
                      aria-describedby={
                        errors.category ? 'category-error' : undefined
                      }
                      onChange={event =>
                        field('category', event.target.value)
                      }
                    >
                      <option value="">Select your category</option>

                      {PARTICIPANT_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    {errors.category && (
                      <p
                        id="category-error"
                        className="text-xs text-red-700 mt-2"
                      >
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {showCompany &&
                    input(
                      'companyName',
                      'Company or business name',
                      'text',
                      'Business name',
                      'organization',
                    )}

                  {input(
                    'discovery',
                    'How did you hear about us?',
                    'text',
                    'e.g. LinkedIn, WhatsApp or a friend',
                  )}

                  <div hidden aria-hidden="true">
                    <label htmlFor="website">
                      Leave this field empty
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={event =>
                        field('website', event.target.value)
                      }
                    />
                  </div>
                  
<p className="text-xs text-[#4A5B53] leading-relaxed">
  We’ll use your details to send your registration confirmation
  and seminar joining information.
</p>

<label className="flex gap-3 text-sm leading-relaxed items-start"></label>

                  <label className="flex gap-3 text-sm leading-relaxed items-start">
                    <input
                      id="registration-consent"
                      name="consentRequired"
                      type="checkbox"
                      checked={form.consentRequired}
                      onChange={event =>
                        field('consentRequired', event.target.checked)
                      }
                      className="mt-1 w-4 h-4 shrink-0 accent-[#0F3324]"
                      aria-invalid={!!errors.consentRequired}
                      aria-describedby={
                        errors.consentRequired
                          ? 'consent-error'
                          : undefined
                      }
                    />
                    <span>
  {CONSENT_TEXT}{' '}
  <span className="text-[#4A5B53]">(optional)</span>
</span>
                  </label>

                  {errors.consentRequired && (
                    <p
                      id="consent-error"
                      className="text-xs text-red-700"
                    >
                      {errors.consentRequired}
                    </p>
                  )}

                  <p className="text-xs text-[#4A5B53] leading-relaxed">
                    HyreMoto uses your details for seminar registration
                    and communications. Read our{' '}
                    <a
                      href="https://hyremoto.com/legal#company"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-[#0F3324]"
                    >
                      Privacy Policy
                    </a>
                    . For privacy requests, contact{' '}
                    <a
                      href="mailto:info@hyremoto.com"
                      className="underline"
                    >
                      info@hyremoto.com
                    </a>
                    .
                  </p>
                </fieldset>

                {registrationConfigured && (
                  <Turnstile onToken={onToken} reset={reset} />
                )}

                {failure && (
                  <p
                    role="alert"
                    className="text-sm text-red-800 bg-red-50 p-4 rounded-xl"
                  >
                    {failure}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending || !registrationConfigured}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#7BCB88] text-[#0F3324] py-4 font-bold hover:bg-[#A7E2B1] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pending && (
                    <Loader2 className="animate-spin" size={18} />
                  )}

                  {pending
                    ? 'Saving…'
                    : registrationConfigured
                      ? 'Register My Interest'
                      : 'Registration Opens Soon'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}