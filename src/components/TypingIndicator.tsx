const TypingIndicator = () => (
    <div className="flex items-start space-x-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
        🤖
      </div>
      <div className="max-w-xs rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-800">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
  
  export default TypingIndicator;