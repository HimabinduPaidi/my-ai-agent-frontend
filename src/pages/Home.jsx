import { useDispatch, useSelector } from "react-redux";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { APP_NAME, APP_INITIAL, APP_ARCHITECTURE } from "../config/brand";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const login = async (token) => {
    try {
      const { data } = await api.post(`/api/auth/login`, { token });
      dispatch(setUserData(data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    await login(token);
  };

  return (
    <div className="h-screen flex bg-background text-text-primary overflow-hidden">
      <Sidebar />
      <ChatArea />
      <ArtifactPanel />

      <Modal open={!userData} dismissible={false}>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">{APP_INITIAL}</span>
              </div>
              <span className="text-base font-semibold text-text-primary tracking-tight">
                {APP_NAME}
              </span>
            </div>
            <h2 className="text-[17px] font-semibold text-text-primary tracking-tight">
              Welcome back
            </h2>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Sign in to access your workspace. {APP_ARCHITECTURE}
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleGoogleLogin}
            className="w-full"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="text-[11px] text-text-muted text-center leading-relaxed">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
