import React, { useState } from 'react';
import { MessageSquare, Edit2 } from 'lucide-react';

interface CommentCardProps {
  title?: string;
  comment?: string;
  author?: string;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  title = 'Comment',
  comment = 'Remember to test both edge cases for recursion depth!',
  author = 'Deepak R.',
}) => {
  const [text, setText] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
          <span>{author}</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-neutral-400 hover:text-neutral-600"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
          rows={3}
        />
      ) : (
        <p className="text-xs text-neutral-700 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
          {text}
        </p>
      )}
    </div>
  );
};
