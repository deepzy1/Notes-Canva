import React, { useState } from 'react';
import { MessageSquare, Edit2, Check } from 'lucide-react';

interface CommentCardProps {
  title?: string;
  comment?: string;
  author?: string;
  onUpdate?: (updated: { comment?: string }) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  title = 'Comment',
  comment = 'Remember to test both edge cases for recursion depth!',
  author = 'Deepak R.',
  onUpdate,
}) => {
  const [text, setText] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);

  const saveComment = () => {
    setIsEditing(false);
    onUpdate?.({ comment: text });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
          <span>{author}</span>
        </div>
        <button
          onClick={() => {
            if (isEditing) saveComment();
            else setIsEditing(true);
          }}
          className="text-neutral-400 hover:text-purple-600 cursor-pointer p-0.5"
          title={isEditing ? 'Save comment' : 'Edit comment'}
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Edit2 className="w-3 h-3" />}
        </button>
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={saveComment}
          className="w-full text-xs p-2 rounded-lg border border-purple-300 bg-white outline-hidden focus:ring-1 focus:ring-purple-200"
          rows={3}
        />
      ) : (
        <p
          onDoubleClick={() => setIsEditing(true)}
          className="text-xs text-neutral-700 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 cursor-text hover:bg-purple-50/80 transition-colors"
          title="Double-click to edit comment"
        >
          {text}
        </p>
      )}
    </div>
  );
};
