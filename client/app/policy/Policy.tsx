import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div>
      <div className="w-[95%] 800px:w-[92%] m-auto py-2 dark:text-white text-black px-3">
        <h1 className={`${styles.title}  pt-2`}>
          Platform Terms and Condition
        </h1>
        <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Account Registration: To access BeReady’s courses, users must create
            an account, providing accurate and up-to-date personal information.
            Users are responsible for maintaining the confidentiality of their
            login credentials and must notify BeReady immediately in case of
            unauthorized account use. BeReady reserves the right to suspend or
            terminate accounts if false information is provided or in case of
            misuse of the platform. All users must be 18 years or older, or have
            parental consent if younger, to register.
          </p>
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Course Access and Usage: BeReady grants users a non-exclusive,
            non-transferable license to access and use the courses for personal,
            non-commercial purposes. Content, including videos, quizzes, and
            study materials, may not be reproduced, distributed, or publicly
            displayed without prior written permission. Users may access courses
            they have enrolled in during the course availability period, which
            may vary by subscription type. BeReady reserves the right to update,
            modify, or remove any course content at any time without prior
            notice.
          </p>
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Payment and Refund Policy: Users must pay applicable fees to enroll
            in courses, either as one-time payments or subscriptions. All prices
            listed are in the applicable currency and exclude taxes unless
            stated otherwise. BeReady offers a refund policy within a specified
            timeframe, usually 14 days from the date of purchase, provided the
            user has not accessed significant portions of the course. Refunds
            may be denied if the user has completed a substantial part of the
            course or violated platform policies.
          </p>
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Code of Conduct: Users are expected to maintain a respectful and
            professional demeanor while interacting with instructors, fellow
            students, and BeReady’s support team. Offensive language,
            harassment, discrimination, or any form of inappropriate behavior
            will result in account suspension or termination. Users must not
            share or upload any malicious content, including viruses or software
            designed to disrupt the platform. BeReady reserves the right to
            monitor user activity and take necessary action in the case of
            violations.
          </p>

          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Intellectual Property Rights: All content on the BeReady platform,
            including but not limited to videos, graphics, logos, and text, is
            the intellectual property of BeReady or its licensors. Unauthorized
            use of this content for commercial purposes or distribution without
            explicit permission is prohibited. Users are granted limited rights
            to view and use the content strictly for personal learning. Any
            infringement on intellectual property rights may result in legal
            action and immediate removal from the platform. BeReady’s branding,
            trademarks, and logos cannot be used without prior written consent.
          </p>
        </ul>
        <br />
      </div>
    </div>
  );
};

export default Policy;
