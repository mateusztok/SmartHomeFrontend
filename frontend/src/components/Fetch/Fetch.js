const fetchFieldsDictionary = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/fields-dictionary/', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; 
  }
};

export default fetchFieldsDictionary;
