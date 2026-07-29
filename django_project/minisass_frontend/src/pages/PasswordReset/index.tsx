import React from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { ForgotPasswordForm } from "../../components/ForgotPasswordForm";
import PasswordResetForm from "../../components/PasswordResetForm";


const PasswordResetPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uid = params.get("uid");
  const token = params.get("token");

  // Derived rather than held in state: the page has to follow the URL, and the
  // previous useState was seeded once and never updated, so arriving from an
  // emailed reset link via client-side navigation showed the wrong form.
  const isForgotPassword = !uid && !token;

  return (
    <AppShell>
      {/*
        Laid out with the same hero and content containers as the rest of the
        site - see Howto, Map and MainPage - so this page lines up with them and
        the form sits under its own heading.

        It previously kept the original generated layout: a fixed 282px banner
        and a full-width wrapper with items-start. Above 640px that wrapper
        stretched edge to edge and pinned the form hard against the left of the
        viewport, nowhere near the heading above it. The negative margins in the
        form components were attempts to compensate for that from the inside.
      */}
      <section className="bg-surface-muted px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-content">
          <h1 className="font-raleway text-display-lg text-primary">
            {isForgotPassword ? "Forgot Password" : "Update Password"}
          </h1>
          <p className="mt-3 max-w-2xl text-body-lg text-text-muted">
            {isForgotPassword
              ? "Enter the email address you registered with and we will send you a link to reset your password."
              : "Choose a new password for your miniSASS account."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        {isForgotPassword ? (
          <ForgotPasswordForm />
        ) : (
          // ?? "" because URLSearchParams.get returns string | null, while the
          // form declares string defaults. Passing null straight through was a
          // long-standing type error.
          <PasswordResetForm uid={uid ?? ""} token={token ?? ""} />
        )}

        <p className="mt-10">
          {/* A real link rather than a span with an onClick, so it can be
              focused, opened in a new tab, and read as a link. */}
          <a
            href="/"
            className="font-raleway text-body text-accent hover:underline"
          >
            Go Back
          </a>
        </p>
      </section>
    </AppShell>
  );
};

export default PasswordResetPage;
