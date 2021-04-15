import Link from "next/link";

const About = () => {
  return (
    <div className="homepg">
      <h4>
        Visit&nbsp;
        <a href="https://mochimo.org" target="_blank">
          Mochimo.org
        </a>
      </h4>
      <Link href="/">Go Back home</Link>
    </div>
  );
};

export default About;
