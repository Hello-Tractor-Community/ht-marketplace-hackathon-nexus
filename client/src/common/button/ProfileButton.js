
const ProfileButton = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    
    const handleLogout = () => {
      dispatch(logout());
    };
  
    const getProfileLink = () => {
      return user.businessDetails 
        ? '/business-portal'
        : '/customer-portal';
    };
  
    return (
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2"
        >
          <FaUserCircle className="text-lg" />
          {user.businessDetails ? 'Business Portal' : 'My Account'}
        </Button>
  
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <a
                href={getProfileLink()}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ProfileButton;