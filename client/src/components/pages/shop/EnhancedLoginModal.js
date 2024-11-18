const EnhancedLoginModal = ({ authType, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [isRegisterMode, setIsRegisterMode] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        if (isRegisterMode) {
          await dispatch(registerUser({
            ...formData,
            userType: authType
          }));
        } else {
          const loginAction = authType === 'business' 
            ? loginBusiness
            : loginUser;
          
          await dispatch(loginAction(formData));
        }
        onClose();
      } catch (error) {
        console.error('Auth failed:', error);
        alert(error.message || 'Authentication failed. Please try again.');
      }
    };
  
    return (
      <div className="login-modal__overlay">
        <div className="login-modal__content">
          <div className="login-modal__header">
            <h2>
              {isRegisterMode ? 'Register' : 'Login'} as {authType === 'business' ? 'Business' : 'Customer'}
            </h2>
            <button className="login-modal__close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="login-modal__body">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border rounded mt-2"
              required
            />
  
            <Button 
              type="submit" 
              variant="primary"
              className="w-full mt-4"
            >
              {isRegisterMode ? 'Register' : 'Login'}
            </Button>
  
            {!isRegisterMode && authType === 'customer' && (
              <>
                <div className="login-modal__divider">
                  <span>or</span>
                </div>
                
                <div className="login-modal__social">
                  <Button variant="quaternary" onClick={() => {}}>
                    <FaGoogle />
                    <span>Continue with Google</span>
                  </Button>
                  <Button variant="tertiary" onClick={() => {}}>
                    <FaFacebookF />
                    <span>Continue with Facebook</span>
                  </Button>
                </div>
              </>
            )}
  
            <div className="login-modal__toggle mt-4 text-center">
              <p>
                {isRegisterMode 
                  ? 'Already have an account?' 
                  : "Don't have an account?"}
              </p>
              <Button
                variant="link"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? 'Login' : 'Register'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default EnhancedLoginModal;