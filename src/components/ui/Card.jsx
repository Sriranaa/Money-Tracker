export default function Card({ children, className = "", as: Component = "section" }) {
  return <Component className={`surface min-w-0 p-4 sm:p-5 ${className}`}>{children}</Component>;
}
