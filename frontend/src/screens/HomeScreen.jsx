import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl, Alert, Card } from 'react-bootstrap';
import { useShortenUrlMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import Header from '../components/Header';

const HomeScreen = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortenUrl] = useShortenUrlMutation();

  const isValidUrl = (url) => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
    return urlRegex.test(url);
  };

  const handleUrlShorten = async (e) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL format.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await shortenUrl({ longUrl }).unwrap();
      console.log('API Response:', response);

      const { shortenedUrl } = response.data;

      if (shortenedUrl) {
        setShortUrl(shortenedUrl);
      } else {
        setError('No shortened URL returned.');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="containerMain">
        <Card className="shadow border-0">
          <Card.Body>
            <h1 className="mb-4 text-center">URL Shortener</h1>

            {loading && <Loader />}

            {!loading && (
              <Form onSubmit={handleUrlShorten}>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter long URL"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="border-0"
                  />
                  <Button type="submit" variant="primary">
                    Shorten URL
                  </Button>
                </InputGroup>
              </Form>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {shortUrl && (
              <Alert variant="success">
                <strong className='me-2'>Shortened URL:</strong>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default HomeScreen;
