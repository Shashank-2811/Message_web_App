import AuthForm from "./AuthForm/AuthForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../@/components/ui/dialog";

const AuthHome = () => {
  return (
    <div>
      <Dialog open={true}>
        <DialogContent className="text-center">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="flex justify-center font-bold">
              <img
                className="flex items-center "
                alt="Logo"
                height="48"
                width="48"
                src="images.png"
              />
            </DialogTitle>
            <DialogDescription className="text-2xl text-center font-bold text-zinc-800">
              Sign in to your account
            </DialogDescription>
          </DialogHeader>

          <AuthForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthHome;
