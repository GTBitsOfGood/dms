import React, { useState, useCallback, useRef } from "react";

import { login } from "requests/admin";
import { useRouter } from "next/router";
import errors from "utils/errors";
import config from "config";
import cookie from "js-cookie";

import { CoreButton } from "@core/buttons";

import AuthPageForm from "./AuthPageForm";
import EmailTextField, { EMAIL_INPUT_FIELD_NAME } from "./EmailTextField";
import PasswordTextField, {
  PASSWORD_INPUT_FIELD_NAME
} from "./PasswordTextField";

import { ContentComponentProps } from "components/auth";

const LoginFormContent: React.FC<ContentComponentProps> = ({
  navigateToContent
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  const onPressCTA = useCallback(
    async (stopLoading: () => void) => {
      try {
        const data = new FormData(formRef.current ?? undefined);
        const email = data.get(EMAIL_INPUT_FIELD_NAME) as string;
        const password = data.get(PASSWORD_INPUT_FIELD_NAME) as string;

        /* Not setting expires explicitly - the time of expiry is taken care of by the server when it creates the token.
         * A browser may still store the expired token, however calling checkToken on it would return false.
         * If a user logs in again, the expired token will be re-written with a freshly generated one. */
        cookie.set("token", await login(email, password));
        // Currently, it takes a long time to navigate and load the index page, so don't stop loading:
        void router.push(config.pages.index);
      } catch (err) {
        let message;
        if (
          err instanceof Error &&
          err.message === errors.admin.INVALID_LOGIN
        ) {
          message = errors.admin.INVALID_LOGIN;
        }
        setError(message ?? errors.GENERIC_TEXT);
        stopLoading();
      }
    },
    [router]
  );

  const onClickForgotPassword = useCallback(() => {
    navigateToContent("forgotPassword");
  }, [navigateToContent]);

  return (
    <AuthPageForm
      ref={formRef}
      title="Sign In"
      ctaText="SIGN IN"
      onPressCTA={onPressCTA}
      footer={
        <CoreButton variant="contained" onClick={onClickForgotPassword}>
          Forgot password?
        </CoreButton>
      }
    >
      <EmailTextField hasError={Boolean(error)} />
      <PasswordTextField hasError={Boolean(error)} hasErrorHelperText={error} />
    </AuthPageForm>
  );
};

export default LoginFormContent;
