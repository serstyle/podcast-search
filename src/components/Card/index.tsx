import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const Card = ({ children }: Props) => {
  return (
    <div className="mb-3 rounded-md bg-white/10 p-2 hover:bg-white/20">
      {children}
    </div>
  );
};

export default Card;
