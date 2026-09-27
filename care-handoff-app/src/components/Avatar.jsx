export default function Avatar({ user, size }) {
  const style = {
    background: user.avatarColor || "#999",
    ...(size ? { width: size, height: size, fontSize: size * 0.4 } : {}),
  };
  return (
    <div className="avatar" style={style}>
      {user.name?.slice(0, 1)}
    </div>
  );
}
