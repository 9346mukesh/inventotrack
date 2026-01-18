import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, ChevronLeft, ArrowRight } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <AlertCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100">Your transaction could not be processed</p>
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">
            {/* ERROR MESSAGE */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">What happened?</p>
              <p className="text-sm text-red-700">
                There was an issue processing your payment. This could be due to:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                <li>Insufficient funds</li>
                <li>Card details mismatch</li>
                <li>Network connection issue</li>
                <li>Card expired or disabled</li>
              </ul>
            </div>

            {/* WHAT TO DO */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Try these steps:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>1. Check your card details and try again</p>
                <p>2. Use a different payment method</p>
                <p>3. Contact your bank for any issues</p>
                <p>4. Try again later if it's a temporary issue</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Try Again
              </button>

              <Link
                to="/cart"
                className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Back to Cart
              </Link>

              <Link
                to="/products"
                className="text-center text-sm text-gray-600 hover:text-indigo-600 font-medium py-2"
              >
                Continue Shopping
              </Link>
            </div>

            {/* CONTACT SUPPORT */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700">
                Need help? <span className="font-semibold">Contact Support</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">We're here to help 24/7</p>
            </div>
          </div>
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-xs text-gray-600">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;