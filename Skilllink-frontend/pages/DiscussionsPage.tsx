
import React from 'react';

const DiscussionsPage: React.FC = () => {
  // This page can be expanded to show a list of discussion channels
  // or a global chat. For now, it's a placeholder.
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold font-heading mb-8">Discussions</h1>
      <div className="bg-secondary dark:bg-neutral-gray-dark rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold">Centralized Discussion Hub</h2>
        <p className="text-neutral-gray-light mt-2">
          This is where you'll find all your discussion channels. <br />
          For now, please refer to the discussion section on each assignment's detail page.
        </p>
      </div>
    </div>
  );
};

export default DiscussionsPage;
