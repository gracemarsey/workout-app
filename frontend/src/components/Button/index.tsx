export const Button = ({ text }: { text: string }) => {
  return (
    <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white transition-all hover:scale-105 hover:bg-blue-700">
      {text}
    </button>
  );
};
