import React, { useRef } from "react";
import { useScroll, useTransform, useSpring, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: fadeProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.1"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotateRaw  = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const rotate     = useSpring(rotateRaw, { stiffness: 60, damping: 22, mass: 0.4 });
  const scale      = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const opacity    = useTransform(fadeProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div
      className="h-[56rem] md:h-[74rem] flex items-center justify-center relative p-2 md:p-14 overflow-hidden"
      ref={containerRef}
    >
      <motion.div className="py-8 md:py-32 w-full relative" style={{ perspective: "1200px", opacity }}>
        <Header titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </motion.div>
    </div>
  );
};

export const Header = ({ titleComponent }: { titleComponent: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto text-center mb-8">
    {titleComponent}
  </div>
);

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{ rotateX: rotate, scale }}
    className="max-w-5xl mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#2A2825] p-2 md:p-5 bg-[#15140F] rounded-[30px]"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#FBF8F2]">
      {children}
    </div>
  </motion.div>
);
