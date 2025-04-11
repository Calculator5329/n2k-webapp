import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function SignoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const doSignOut = async () => {
      try {
        await signOut(auth);
        console.log("✅ Signed out");
        navigate("/"); // Redirect home
      } catch (err) {
        console.error("❌ Error signing out:", err.message);
      }
    };

    doSignOut();
  }, [navigate]);

  return <p style={{ color: "white", padding: "2rem" }}>Signing out...</p>;
}

export default SignoutPage;
