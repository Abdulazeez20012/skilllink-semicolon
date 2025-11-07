
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light-gray dark:bg-neutral-soft-black text-center p-4">
      <h1 className="text-9xl font-bold font-heading text-primary">404</h1>
      <h2 className="text-4xl font-bold text-neutral-soft-black dark:text-white mt-4">Page Not Found</h2>
      <p className="text-neutral-gray-light mt-2 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
