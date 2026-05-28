import React from "react";
import API from "../services/api";

export default function useFetch(url, options = {}) {
  const [data, setData] = React.React.useState(null);
  const [loading, setLoading] = React.React.useState(true);
  const [error, setError] = React.React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    API(url, options)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
