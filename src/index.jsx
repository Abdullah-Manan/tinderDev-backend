const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const resetForm = () => setValues(initialState);
  return [values, handleChange, resetForm];
};

const withLoading = (WrappedComponent) => {
  return function WithLoading(props) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      setTimeout(() => setIsLoading(false), 2000);
    }, []);
    return isLoading ? <div>Loading...</div> : <WrappedComponent {...props} />;
  };
};
