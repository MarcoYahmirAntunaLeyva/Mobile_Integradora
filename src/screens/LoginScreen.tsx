import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  View,
  Text,
} from "react-native";
import HeaderComponent from "../components/header";
import TabSelectorComponent from "../components/tab";
import LoginFormComponent from "../components/loginForm";
import RegisterFormComponent from "../components/registerForm";
import LoadingComponent from "../components/loading";
import useAuth from "../hooks/useAuth";
import useTokenManagement from "../hooks/useToken";
import useGoogleSignIn from "../hooks/useGoogle";
import PasswordResetModal from "../components/passwordReset";
import usePasswordReset from "../hooks/usePasswordR";
import styles from "../styles/styles";

const LoginScreen: React.FC = () => {
  const { promptAsync } = useGoogleSignIn();
  const [selectedTab, setSelectedTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  const passwordReset = usePasswordReset();
  const [showResetModal, setShowResetModal] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const { height, width } = Dimensions.get("window");

  const [middleName, setmiddleName] = useState<string>("");
  const [firstName, setfirstName] = useState<string>("");
  const [lastName, setlastName] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [phoneNumber, setphoneNumber] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [confirmPassword, setconfirmPassword] = useState<string>("");

  // Initialize hooks
  useGoogleSignIn();
  const { isTokenExpiredLocally } = useTokenManagement({ setIsCheckingToken });
  const { handleLogin, handleRegister } = useAuth({
    setError,
    isTokenExpiredLocally,
  });

  if (isCheckingToken) {
    return <LoadingComponent />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <PasswordResetModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        {...passwordReset}
      />
      <HeaderComponent />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formWrapper}>
          <Text style={styles.title}>SUDAI ACUAPONIA</Text>
          <TabSelectorComponent
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            setError={setError}
          />
          {selectedTab === "login" ? (
            <LoginFormComponent
              email={email}
              setEmail={setemail}
              password={password}
              setPassword={setpassword}
              error={error}
              handleLogin={() => handleLogin(email, password)}
              handleGoogleSignIn={() => promptAsync()}
              handleForgotPassword={() => setShowResetModal(true)}
            />
          ) : (
            <RegisterFormComponent
              middleName={middleName}
              setmiddleName={setmiddleName}
              firstName={firstName}
              setfirstName={setfirstName}
              lastName={lastName}
              setlastName={setlastName}
              email={email}
              setemail={setemail}
              phoneNumber={phoneNumber}
              setphoneNumber={setphoneNumber}
              password={password}
              setpassword={setpassword}
              confirmPassword={confirmPassword}
              setconfirmPassword={setconfirmPassword}
              error={error}
              handleRegister={() =>
                handleRegister(
                  middleName,
                  firstName,
                  lastName,
                  email,
                  phoneNumber,
                  password,
                  confirmPassword
                )
              }
              handleGoogleSignIn={() => promptAsync()}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
