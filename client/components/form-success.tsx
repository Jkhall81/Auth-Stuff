import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string;
  submissionStatus: string;
}

export const FormSuccess = ({
  message,
  submissionStatus,
}: FormSuccessProps) => {
  if (submissionStatus !== "success") return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <FaCheckCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
