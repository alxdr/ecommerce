import React from "react";

const Connect = React.memo(() => {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  return (
    <div className="row justify-content-center">
      <div className="card">
        <div className="card-body d-flex flex-column align-items-center">
          <div className="card-title">
            Start earning more cash by selling stuff online!
          </div>
          <a
            href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
              process.env.CLIENT_ID
            }&scope=read_write&state=${token}`}
          >
            <img
              src="/local/images/blue-on-light.png"
              alt="Connect with Stripe"
            />
          </a>
        </div>
      </div>
    </div>
  );
});

export default Connect;
