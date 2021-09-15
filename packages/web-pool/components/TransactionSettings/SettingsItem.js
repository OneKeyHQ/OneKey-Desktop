const SettingsItem = ({ children, title, description }) => {
  return (
    <div>
      <h5 className="font-medium text-gray-900">{title}</h5>
      <p className="text-gray-500">{description}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default SettingsItem;