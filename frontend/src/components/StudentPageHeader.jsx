function StudentPageHeader({ title, subtitle, action }) {
  return (
    <div className="host-page-header">
      <div className="host-page-header__text">
        <h1 className="host-page-header__title">{title}</h1>
        {subtitle && <p className="host-page-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="host-page-header__action">{action}</div>}
    </div>
  );
}

export default StudentPageHeader;
