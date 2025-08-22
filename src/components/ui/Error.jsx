import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="w-20 h-20 bg-error bg-opacity-20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={40} className="text-error" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {message}. Please check your connection and try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;