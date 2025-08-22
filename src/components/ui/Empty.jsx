import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No movies found", 
  description = "Check back later for new releases",
  actionLabel = "Browse Movies",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Film" size={48} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Search" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;