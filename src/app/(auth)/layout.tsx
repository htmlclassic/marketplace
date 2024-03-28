export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow flex items-center justify-center side-padding">
      {children}
    </div>
  );
}