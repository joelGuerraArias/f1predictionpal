import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Check if user has a profile in f1.profiles
          const { data: profile, error: profileError } = await supabase
            .from('f1.profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('f1.profiles')
              .insert([
                { 
                  id: session.user.id,
                  email: session.user.email
                }
              ]);

            if (insertError) {
              console.error('Error creating f1 profile:', insertError);
              setErrorMessage("Error al crear el perfil de usuario");
              return;
            }
          }

          navigate("/");
        }
        if (event === "USER_UPDATED") {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        }
        if (event === "SIGNED_OUT") {
          setErrorMessage("");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case "invalid_credentials":
          return "Credenciales inválidas. Por favor verifica tus datos.";
        case "email_not_confirmed":
          return "Por favor verifica tu correo electrónico antes de iniciar sesión.";
        case "user_not_found":
          return "No se encontró ningún usuario con estas credenciales.";
        case "invalid_grant":
          return "Credenciales de inicio de sesión inválidas.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-f1-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-wider">
            <span className="text-white">PREDICTOR</span>
            <span className="text-f1-red">/F1</span>
          </h2>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Inicia sesión en tu cuenta
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-f1-gray py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#E10600',
                    brandAccent: '#cc0600',
                    inputBackground: '#15151E',
                    inputText: 'white',
                    inputPlaceholder: '#666',
                    inputBorder: '#38383f',
                    inputBorderHover: '#444',
                    inputBorderFocus: '#E10600',
                    dividerBackground: '#38383f',
                  },
                },
              },
              className: {
                container: 'text-white',
                label: 'text-white',
                button: 'bg-f1-red hover:bg-red-700 text-white',
                input: 'bg-f1-dark border-f1-gray text-white',
              }
            }}
            theme="dark"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Correo electrónico",
                  password_label: "Contraseña",
                  button_label: "Iniciar sesión",
                },
                sign_up: {
                  email_label: "Correo electrónico",
                  password_label: "Contraseña",
                  button_label: "Registrarse",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;