import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import P from "../Shared/P/P";
import pic from "./office.jpg";

const UsesWrapper = styled.section`
  text-align: left;
  margin-top: 40px;
  min-height: 100%;
  padding: 10px 0;
  a {
    font-weight: bold;
  }
`;

const UsesPic = styled.img`
  box-shadow: 0 0 0 3px white, 0 3px 8px 3px #ccc;
  margin: 20px 0;
`;

const Headline = styled.h1`
  margin-top: 20px;
  text-align: left;
`;

const Uses = () => (
  <UsesWrapper>
    <Headline>What I use</Headline>
    <UsesPic src={pic} alt="my office" title="my office" />
    <h2>Desk Setup</h2>
    <p>
      <ul>
        <li>
          My main desk is a{" "}
          <Link to="https://www.inwerk-bueromoebel.de/buerotische/hoehenverstellbare-schreibtische/steh-sitz-schreibtisch-masterlift2-sw-chrom-bm56947.html">
            Masterlift 2
          </Link>{" "}
          adjustable standing desk.
        </li>
        <li>
          My office chair is a used{" "}
          <Link to="https://www.designcabinet.de/herman-miller-aeron-chair-groesse-b-655">
            Hermann Miller Aeron
          </Link>{" "}
          in size B.
        </li>
        <li>
          Since this year I am using a Macbook pro 16". It is the best computer
          I ever owned.
        </li>
        <li>
          My monitor is the{" "}
          <Link to="hhttps://www.amazon.com/LG-32UD59-B-32-Inch-LED-Lit-FreeSync/dp/B0748KJY4Q">
            LG 32UD59-B
          </Link>{" "}
          with a 2560 x 1440 resolution.
        </li>
        <li>
          I use the{" "}
          <Link to="https://www.therooststand.com/">roost laptop stand</Link>{" "}
          for my Laptop at home and when I travel.
        </li>
        <li>I use the Apple magic mouse and magic keyboard.</li>
      </ul>
    </p>
    <h2>Terminal and Editor</h2>
    <p>
      <ul>
        <li>
          My favorite editor these days is{" "}
          <Link to="https://code.visualstudio.com/">VS Code</Link>. I do nearly
          all my coding in it. I use the <b>Default Dark+ Theme</b>.
        </li>
        <li>
          I still use{" "}
          <Link to="https://www.sublimetext.com/3">Sublime Text 3</Link> from
          time to time.
        </li>
        <li>
          My Terminal is the good old{" "}
          <Link to="https://www.iterm2.com/version3.html">iTerm 3</Link>. I use
          it together with{" "}
          <Link to="https://github.com/ohmyzsh/ohmyzsh">Oh my zsh</Link> and the{" "}
          <b>smt</b> theme.
        </li>
        <li>
          I have a lot of custom stuff and aliases in{" "}
          <Link to="https://github.com/tmaximini/.dotfiles">dotfiles</Link>.
        </li>
      </ul>
    </p>
    <h2>Apps & Productivity</h2>
    <p>
      <ul>
        <li>
          My most important tool these days is{" "}
          <Link to="https://1password.com/">1Password</Link> which keeps track
          of all my passwords.
        </li>
        <li>
          I use <Link to="https://todoist.com/app">Todoist</Link> to keep track
          of my tasks and daily chores.
        </li>
        <li>
          For my writing and taking quick notes I use{" "}
          <Link to="https://ia.net/writer">iA Writer</Link>.
        </li>
        <li>
          I use <Link to="https://www.spectacleapp.com/">Spectacle</Link> as my
          window manager.
        </li>
        <li>
          <Link to="https://www.macbartender.com/">Bartender</Link> keeps my OSX
          menu bar clean and organized.
        </li>
        <li>
          <Link to="https://www.dropbox.com">Dropbox</Link> helps me to sync and
          backup all my important files across devices.
        </li>
        <li>
          I love{" "}
          <Link to="https://docs.docker.com/docker-for-mac/">Docker</Link>{" "}
          because it helps me to keep my dev machine clean.
        </li>
        <li>
          Sometimes I use <Link to="https://brew.sh/">Homebrew</Link> to install
          missing packages on OSX.
        </li>
        <li>
          <Link to="https://justgetflux.com/">Flux</Link> improves the quality
          of my sleep when working late on my computer.
        </li>
      </ul>
    </p>
  </UsesWrapper>
);

export default Uses;
