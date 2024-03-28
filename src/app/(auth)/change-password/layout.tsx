export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="side-padding grow flex items-center justify-center">
      {children}
    </div>
  );
}