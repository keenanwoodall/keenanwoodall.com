import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { services } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';

import { SectionWrapper } from '../hoc';

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className='xs:w-[250px] w-full'
      options={{
        max: 45,
        scale: 1,
        speed: 450
      }}
    >
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
        <div className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
          <img src={icon} alt={title} className='w-16 h-16 object-contain'/>
          <h3 className='text-white text-[20px] font-bold text-center'>
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {

  const yearsProgramming = yearsSinceDate(new Date("2014"));

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>
          Introduction
        </p>
        <h2 className={`${styles.sectionHeadText}`}>
          Overview.
        </h2>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Hello there! I'm Keenan, but most people know me as "Beans"! 😄
          <br />
          For the past {yearsProgramming} years, I've immersed myself in Unity, crafting powerful tools and "juicy" experiences.
          While my roots were initially in animation, my love for the intersection of math, science, and art quickly led me to programming.
          From writing compute shaders to designing good software architecture - I'm at my best when helping others or learning a new skill.
          As a quick and curious learner with a holistic view of programming I can hit the ground running on any project.
          &nbsp;<b>Let's work together and build something amazing!</b>
        </motion.p>

        <div className='mt-20 flex flex-wrap gap-10'>
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </motion.div>
    </>
  )
}

const yearsSinceDate = (date) => {
  var difference = Date.now() - date;
  return Math.abs(new Date(difference).getUTCFullYear() - 1970);
}

export default SectionWrapper(About, "about")