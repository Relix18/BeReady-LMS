import { styles } from "@/app/styles/style";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutAPI";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ = (props: Props) => {
  const { data } = useGetLayoutQuery("FAQ");
  const [faq, setFaq] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setFaq(data.layout.faqs);
    }
  }, [data]);

  const toggleFaq = (faq: any) => {
    setActiveFaq(activeFaq === faq ? null : faq);
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>
        <div className="mt-12">
          <dl className="space-y-8">
            {faq?.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  item._id !== faq[0]?._id && "border-t"
                } border-gray-200 pt-6`}
              >
                <dt className="text-lg">
                  <button
                    className="flex items-start justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleFaq(item._id)}
                  >
                    <span className="font-medium text-black dark:text-white">
                      {item.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeFaq === item._id ? (
                        <HiMinus className="w-6 h-6 text-black dark:text-white" />
                      ) : (
                        <HiPlus className="w-6 h-6 text-black dark:text-white" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeFaq === item._id && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base font-Poppins text-black dark:text-white">
                      {item.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default FAQ;
