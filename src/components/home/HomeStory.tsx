"use client";

import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { useEffect, useRef, type CSSProperties } from "react";
import type { HomePartAContent, HomePartBContent, HomePartCContent, HomePartC1Content, HomePartDContent, HomePartEContent, HomePartFContent, HomePartGContent, HomePartHContent } from "@/lib/content";
import { ContactScene } from "./ContactScene";
import { getContactFrame, getContactGeometry, type ContactGeometry } from "./contactMotion";
import { DonationScene } from "./DonationScene";
import { getDonationFrame, getDonationGeometry, type DonationGeometry } from "./donationMotion";
import { AboutScene } from "./AboutScene";
import { getAboutGeometry, getAboutFrame, getAboutLetter, type AboutGeometry } from "./aboutMotion";
import { ImpactScene } from "./ImpactScene";
import { getImpactGeometry, getImpactFrame, getImpactLetter, getImpactLine, type ImpactGeometry } from "./impactMotion";
import { ProjectsScene } from "./ProjectsScene";
import { getVegetationPinFrame, measureVegetationPinTravel } from "./vegetationPin";
import { getProjectsFrame, getProjectsGeometry, type ProjectsGeometry } from "./projectsMotion";
import { ArgentinaScene } from "./ArgentinaScene";
import { getArgentinaFrame, getArgentinaWordOpacity } from "./argentinaMotion";
import { ButtonLink } from "@/components/ui/Button";
import { getMountainFrame, MOUNTAIN_LAYERS } from "./mountainMotion";
import { getMissionFrame, getMissionMountainY, MISSION_TIMING } from "./missionMotion";
import { getVegetationFrame, getVegetationGeometry, getVegetationProgress, VEGETATION_LAYERS, type VegetationGeometry } from "./vegetationMotion";
import styles from "./HomeStory.module.css";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const ease = (value: number) => value * value * (3 - 2 * value);
const TITLE_HOLD_PX = 450;

export function HomeStory({ locale, content, partB, partC, partC1, partD, partE, partF, partG, partH }: { locale: Locale; content: HomePartAContent; partB?: HomePartBContent; partC?: HomePartCContent; partC1?: HomePartC1Content; partD?: HomePartDContent; partE?: HomePartEContent; partF?: HomePartFContent; partG?: HomePartGContent; partH?: HomePartHContent }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (motionPreference.matches) return;
      const title = root.querySelector<HTMLElement>("[data-story-title]")!;
      const statementScene = root.querySelector<HTMLElement>("[data-statement-scene]")!;
      const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
      const crossingClouds = Array.from(root.querySelectorAll<HTMLElement>("[data-crossing-cloud]"));
      const mountains = Array.from(root.querySelectorAll<HTMLElement>("[data-mountain]"));
      const missionCopy = root.querySelector<HTMLElement>("[data-mission-copy]");
      const missionTitle = root.querySelector<HTMLElement>("[data-mission-title]");
      const vegetation = Array.from(root.querySelectorAll<HTMLElement>("[data-vegetation]"));
      const vegetationImages = vegetation.map(element => element.querySelector<HTMLImageElement>("img")!);
      const argentinaScene = root.querySelector<HTMLElement>("[data-argentina-scene]");
      const argentinaWindow = root.querySelector<HTMLElement>("[data-argentina-window]");
      const argentinaParagraph = root.querySelector<HTMLElement>("[data-argentina-paragraph]");
      const argentinaWords = Array.from(root.querySelectorAll<HTMLElement>("[data-argentina-word]"));
      const argentinaPhotos = Array.from(root.querySelectorAll<HTMLElement>("[data-argentina-photo]"));
      const projectsScene = root.querySelector<HTMLElement>("[data-projects-scene]");
      const projectsContent = root.querySelector<HTMLElement>("[data-projects-content]");
      const projectTrees = Array.from(root.querySelectorAll<HTMLElement>("[data-project-tree]"));
      const projectWay = root.querySelector<HTMLElement>("[data-project-way]");
      const projectChurch = root.querySelector<HTMLElement>("[data-project-church]");
      const projectVegetation = root.querySelector<HTMLElement>("[data-project-vegetation]");
      const impactScene = root.querySelector<HTMLElement>("[data-impact-scene]");
      const impactCopy = root.querySelector<HTMLElement>("[data-impact-copy]");
      const impactAction = root.querySelector<HTMLElement>("[data-impact-action]");
      const houses = Array.from(root.querySelectorAll<HTMLElement>("[data-impact-house]"));
      const impactLetters = Array.from(root.querySelectorAll<HTMLElement>("[data-impact-letter]"));
      const impactLines = Array.from(root.querySelectorAll<HTMLElement>("[data-impact-line]"));
      const aboutScene = root.querySelector<HTMLElement>("[data-about-scene]");
      const aboutCopy = root.querySelector<HTMLElement>("[data-about-content]");
      const aboutAction = root.querySelector<HTMLElement>("[data-about-action]");
      const aboutGallery = root.querySelector<HTMLElement>("[data-about-gallery]");
      const aboutHouse = root.querySelector<HTMLElement>("[data-about-house]");
      const aboutGrains = Array.from(root.querySelectorAll<HTMLElement>("[data-about-grain]"));
      const aboutLetters = Array.from(root.querySelectorAll<HTMLElement>("[data-about-letter]"));
      const donationScene = root.querySelector<HTMLElement>("[data-donation-scene]");
      const donationContent = root.querySelector<HTMLElement>("[data-donation-content]");
      const donationCta = root.querySelector<HTMLElement>("[data-donation-cta]");
      const cocoaTrees = Array.from(root.querySelectorAll<HTMLElement>("[data-cocoa-tree]"));
      const cocoaGrains = root.querySelector<HTMLElement>("[data-cocoa-grains]");
      const contactScene = root.querySelector<HTMLElement>("[data-contact-scene]");
      const contactContent = root.querySelector<HTMLElement>("[data-contact-content]");
      const contactAction = root.querySelector<HTMLElement>("[data-contact-action]");
      const contactGrains = Array.from(root.querySelectorAll<HTMLElement>("[data-contact-grain]"));
      const contactLetters = Array.from(root.querySelectorAll<HTMLElement>("[data-contact-letter]"));
      let contactGeometry: ContactGeometry | undefined;
      let contactDistance = 1;
      let contactOverflow = 0;
      let donationReadingDistance = 0;
      let donationGeometry: DonationGeometry | undefined;
      let donationDistance = 1;
      let donationOverflow = 0;
      let aboutReadingDistance = 0;
      let viewportHeight = 1;
      let aboutDistance = 1;
      let impactCopyHeight = 0;
      let aboutContentOverflow = 0;
      let aboutGeometry: AboutGeometry | undefined;
      let impactDistance = 1;
      let impactGeometry: ImpactGeometry | undefined;
      let projectsDistance = 1;
      let vegetationTravel = 0;
      let projectsGeometry: ProjectsGeometry | undefined;
      let argentinaDistance = 1;
      let argentinaTextHeight = 0;
      let argentinaWindowHeight = 0;
      let frame = 0;
      let top = 0;
      let distance = 1;
      let mountainDistance = 1;
      let missionDistance = 1;
      let vegetationDistance = 1;
      let vegetationGeometry: VegetationGeometry[] = [];
      let firstMountainHeightVh = 84;
      let titleRadius = 1;
      let inView = true;
      const update = () => {
        frame = 0;
        const progress = clamp((window.scrollY - top) / distance);
        const mountainProgress = clamp((window.scrollY - top - distance) / mountainDistance);
        const afterC1 = window.scrollY - top - distance - mountainDistance - missionDistance - vegetationDistance - argentinaDistance;
        const pin = getVegetationPinFrame(afterC1, projectsDistance, vegetationTravel);
        root.dataset.vegetationPin = partD ? pin.mode : "intro";
        const progressD = pin.progressD;
        const projectsFrame = partD && projectsGeometry ? getProjectsFrame(progressD, projectsGeometry) : null;
        const progressE = clamp((afterC1 - vegetationTravel - projectsDistance) / impactDistance);
        const impactFrame = partE && impactGeometry ? getImpactFrame(progressE, impactGeometry) : null;
        const progressF = clamp((afterC1 - vegetationTravel - projectsDistance - impactDistance) / aboutDistance);
        const aboutFrame = partF && aboutGeometry ? getAboutFrame(progressF, aboutGeometry) : null;
        // Separate reading distance: do not squeeze the enlarged gallery into the reveal.
        const afterAboutReveal = afterC1 - vegetationTravel - projectsDistance - impactDistance - aboutDistance;
        const aboutReadingTravel = partF ? Math.min(aboutContentOverflow, Math.max(0, afterAboutReveal)) : 0;
        const afterAbout = afterAboutReveal - aboutReadingDistance;
        const progressG = clamp(afterAbout / donationDistance);
        const donationFrame = partG && donationGeometry ? getDonationFrame(progressG, donationGeometry) : null;
        root.dataset.donationBackdropVisible = String(donationFrame?.backdropVisible ?? false);
        const afterDonation = afterAbout - donationDistance - donationReadingDistance;
        const progressH = clamp(afterDonation / contactDistance);
        const contactFrame = partH && contactGeometry ? getContactFrame(progressH, contactGeometry) : null;
        root.style.setProperty("--donation-blur", `${(donationFrame?.blur ?? 0) * (contactFrame?.blurFactor ?? 1)}px`);
        if (contactFrame && contactScene) {
          contactScene.dataset.visible = String(contactFrame.visible);
          contactScene.dataset.copyVisible = String(contactFrame.photo > 0);
          contactScene.dataset.ctaVisible = String(contactFrame.cta > .01);
          if (contactContent) contactContent.inert = contactFrame.photo <= 0;
          if (contactAction) contactAction.inert = contactFrame.cta <= .01;
          contactScene.style.setProperty("--contact-pan", `${contactFrame.pan}px`);
          contactScene.style.setProperty("--contact-content-y", `${-Math.min(contactOverflow, Math.max(0, afterDonation - contactDistance))}px`);
          for (const key of ["photo", "paragraph", "cta", "fruits"] as const) {
            contactScene.style.setProperty(`--contact-${key}`, String(contactFrame[key]));
          }
          contactGrains.forEach((grain, i) => {
            grain.dataset.visible = String(contactFrame.grainsVisible);
            grain.style.setProperty("--grain-x", `${contactFrame.grainX[i]}px`);
          });
          contactLetters.forEach((letter, i) => {
            const state = getAboutLetter(contactFrame.title, i, contactLetters.length);
            letter.style.setProperty("--about-letter-opacity", String(state.opacity));
            letter.style.setProperty("--about-letter-blur", `${state.blur}px`);
            letter.style.setProperty("--about-letter-y", `${state.y}px`);
          });
        }
        if (donationFrame && donationScene) {
          const opacity = donationFrame.cta * (contactFrame?.donationOpacity ?? 1);
          donationScene.dataset.visible = String(donationFrame.visible);
          donationScene.dataset.ctaVisible = String(opacity > .01);
          if (donationCta) donationCta.inert = opacity <= .01;
          donationScene.style.setProperty("--donation-opacity", String(opacity));
          donationScene.style.setProperty("--donation-pan", `${contactFrame?.pan ?? 0}px`);
          donationScene.style.setProperty("--donation-content-y", `${-Math.min(donationOverflow, Math.max(0, afterAbout - donationDistance))}px`);
          cocoaTrees.forEach((tree, i) => {
            tree.dataset.visible = String(donationFrame.treesVisible);
            tree.style.setProperty("--cocoa-rise", `${donationFrame.treeY[i]}px`);
          });
          if (cocoaGrains) {
            cocoaGrains.dataset.visible = String(donationFrame.grainsVisible);
            cocoaGrains.style.setProperty("--cocoa-rise", `${donationFrame.grainY}px`);
          }
        }
        const extraPan = (aboutFrame?.extraPan ?? 0) - aboutReadingTravel + (contactFrame?.pan ?? 0);
        if (aboutFrame && aboutScene) {
          aboutScene.dataset.visible = String(aboutFrame.visible);
          const aboutVisible = aboutFrame.title > 0 && (donationFrame?.aboutOpacity ?? 1) > .01;
          aboutScene.dataset.copyVisible = String(aboutVisible);
          aboutScene.dataset.ctaVisible = String(aboutVisible && aboutFrame.cta > .01);
          aboutScene.dataset.galleryVisible = String(aboutVisible && aboutFrame.gallery > .01);
          if (aboutCopy) aboutCopy.inert = !aboutVisible;
          if (aboutAction) aboutAction.inert = aboutFrame.cta <= .01;
          if (aboutGallery) aboutGallery.inert = aboutFrame.gallery <= .01;
          aboutScene.style.setProperty("--about-pan", `${(impactFrame?.pan ?? 0) + extraPan}px`);
          aboutScene.style.setProperty("--about-overlay", String(aboutFrame.overlay * (donationFrame?.overlayFactor ?? 1)));
          aboutScene.style.setProperty("--about-exit-opacity", String(donationFrame?.aboutOpacity ?? 1));
          aboutScene.style.setProperty("--about-paragraph", String(aboutFrame.paragraph));
          aboutScene.style.setProperty("--about-cta", String(aboutFrame.cta));
          aboutScene.style.setProperty("--about-cta-scale", String(.85 + .15 * aboutFrame.cta));
          aboutScene.style.setProperty("--about-cta-clip", `${50 * (1 - aboutFrame.cta)}%`);
          aboutScene.style.setProperty("--about-gallery", String(aboutFrame.gallery));
          aboutScene.style.setProperty("--about-content-y", `${-aboutReadingTravel - (donationFrame?.aboutExit ?? 0) * viewportHeight * .3}px`);
          if (aboutHouse) {
            aboutHouse.dataset.visible = String(aboutFrame.houseVisible);
            aboutHouse.style.setProperty("--house-x", `${aboutFrame.houseX}px`);
          }
          aboutGrains.forEach((grain, i) => {
            grain.dataset.visible = String(aboutFrame.grainVisible[i]);
            grain.style.setProperty("--grain-y", `${aboutFrame.grainY[i]}px`);
          });
          aboutLetters.forEach((letter, i) => {
            const state = getAboutLetter(aboutFrame.title, i, aboutLetters.length);
            letter.style.setProperty("--about-letter-opacity", String(state.opacity));
            letter.style.setProperty("--about-letter-blur", `${state.blur}px`);
            letter.style.setProperty("--about-letter-y", `${state.y}px`);
          });
        }
        if (impactFrame && impactScene) {
          impactScene.dataset.visible = String(impactFrame.visible);
          impactScene.dataset.copyVisible = String(impactFrame.title > 0);
          impactScene.dataset.interactive = String(impactFrame.cta > .01);
          if (impactCopy) impactCopy.inert = impactFrame.title <= 0 || impactCopyHeight + extraPan <= 0 || (aboutFrame?.overlay ?? 0) > 0;
          if (impactAction) impactAction.inert = impactFrame.cta <= .01;
          impactScene.style.setProperty("--impact-pan", `${impactFrame.pan + extraPan}px`);
          impactScene.style.setProperty("--impact-copy-y", `${extraPan}px`);
          root.style.setProperty("--impact-blur", `${impactFrame.blur * (aboutFrame?.blurFactor ?? 1)}px`);
          impactScene.style.setProperty("--impact-cta", String(impactFrame.cta));
          impactScene.style.setProperty("--impact-cta-scale", String(.85 + .15 * impactFrame.cta));
          impactScene.style.setProperty("--impact-cta-clip", `${50 * (1 - impactFrame.cta)}%`);
          houses.forEach((house, i) => {
            house.dataset.visible = String(impactFrame.houseVisible[i]);
            house.style.setProperty("--house-x", `${impactFrame.houseX[i]}px`);
          });
          impactLetters.forEach((letter, i) => {
            const state = getImpactLetter(impactFrame.title, i, impactLetters.length);
            letter.style.setProperty("--letter-opacity", String(state.opacity));
            letter.style.setProperty("--letter-rotate", `${state.rotate}deg`);
            letter.style.setProperty("--letter-x", `${state.x}px`);
          });
          impactLines.forEach((line, i) => {
            const reveal = getImpactLine(impactFrame.paragraph, i, impactLines.length);
            line.style.setProperty("--line-clip", `${(1 - reveal) * 100}%`);
            line.style.setProperty("--line-opacity", String(reveal));
          });
        }
        if (projectsFrame && projectsScene) {
          const opacity = projectsFrame.projectsOpacity * (impactFrame?.projectsOpacity ?? 1);
          const interactive = projectsFrame.projectsInteractive && opacity > .1;
          projectsScene.dataset.visible = String(projectsFrame.visible);
          projectsScene.dataset.projectsVisible = String(opacity > 0);
          projectsScene.dataset.interactive = String(interactive);
          projectsScene.style.setProperty("--projects-pan", `${projectsFrame.panY + (impactFrame?.pan ?? 0) + extraPan}px`);
          projectsScene.style.setProperty("--projects-opacity", String(opacity));
          root.style.setProperty("--part-d-background-y", `${projectsFrame.backgroundY + (impactFrame?.pan ?? 0) + extraPan}px`);
          if (projectsContent) projectsContent.inert = !interactive;
          projectTrees.forEach((tree, index) => {
            tree.style.setProperty("--tree-rise", `${projectsFrame.treeY[index]}px`);
            tree.dataset.visible = String(projectsFrame.treeVisible[index]);
          });
          projectWay?.style.setProperty("--way-hidden", `${(1 - projectsFrame.wayReveal) * 100}%`);
          projectWay?.style.setProperty("--church-rise", `${projectsFrame.wayY}px`);
          if (projectVegetation) {
            projectVegetation.style.setProperty("--church-rise", `${projectsFrame.wayY}px`);
            projectVegetation.dataset.visible = String(projectsFrame.churchVisible);
          }
          if (projectChurch) {
            projectChurch.style.setProperty("--church-rise", `${projectsFrame.churchY}px`);
            projectChurch.dataset.visible = String(projectsFrame.churchVisible);
          }
        }
        const missionProgress = partB?.description
          ? clamp((window.scrollY - top - distance - mountainDistance) / missionDistance)
          : 0;
        const mountainFrame = partB ? getMountainFrame(mountainProgress, firstMountainHeightVh) : null;
        if (mountainFrame) {
          root.dataset.mountains = String(mountainFrame.visible);
          root.dataset.covered = String(mountainFrame.covered);
          root.style.setProperty("--camera-scale", String(mountainFrame.cameraScale));
          root.style.setProperty("--landscape-y", `${mountainFrame.entranceVh}svh`);
          const missionFrame = getMissionFrame(mountainProgress, missionProgress);
          root.style.setProperty("--mission-opacity", String(missionFrame.titleOpacity));
          root.style.setProperty("--mission-rise", `${missionFrame.titleRiseVh}svh`);
          root.style.setProperty("--mission-dock", String(missionFrame.dock));
          root.style.setProperty("--mission-scale", String(missionFrame.titleScale));
          root.style.setProperty("--mission-copy-opacity", String(missionFrame.copyOpacity));
          root.style.setProperty("--mission-copy-x", `${missionFrame.copyX}px`);
          root.style.setProperty("--mission-copy-scale", String(missionFrame.copyScale));
          root.dataset.missionCopy = String(missionFrame.copyInteractive);
          if (missionCopy) missionCopy.inert = !missionFrame.copyInteractive;
          mountains.forEach((mountain, index) => {
            const layer = mountainFrame.layers[index];
            if (layer) {
              const y = getMissionMountainY(index, layer.yVh, MOUNTAIN_LAYERS[index].top, missionProgress);
              mountain.style.setProperty("--mountain-y", `${y}svh`);
              mountain.style.setProperty("--mountain-filter", layer.blur ? `blur(${layer.blur}px)` : "none");
            }
          });
        }
        if (partC && vegetationGeometry.length) {
          const vegetationProgress = getVegetationProgress(
            window.scrollY - top - distance - mountainDistance,
            missionDistance, vegetationDistance, MISSION_TIMING.foreground[2],
          );
          const vegetationFrame = getVegetationFrame(vegetationProgress, vegetationGeometry);
          vegetation.forEach((element, index) => {
            const layer = vegetationFrame[index];
            if (!layer) return;
            element.style.setProperty("--vegetation-x", `${layer.x}px`);
            element.style.setProperty("--vegetation-y", `${layer.y}px`);
            element.dataset.visible = String(layer.visible);
          });
        }
        if (argentinaScene) {
          const progressC1 = clamp((window.scrollY - top - distance - mountainDistance - missionDistance - vegetationDistance) / argentinaDistance);
          const argentina = getArgentinaFrame(progressC1, argentinaTextHeight, argentinaWindowHeight);
          const argentinaOpacity = argentina.opacity * (projectsFrame?.previousOpacity ?? 1);
          argentinaScene.dataset.visible = String(argentina.visible && argentinaOpacity > 0);
          argentinaScene.inert = projectsFrame ? !projectsFrame.previousInteractive : false;
          argentinaScene.dataset.ctaVisible = String(argentina.ctaOpacity > 0);
          argentinaScene.style.setProperty("--argentina-cta-opacity", String(argentina.ctaOpacity));
          argentinaScene.style.setProperty("--argentina-rise", `${argentina.riseVh}svh`);
          argentinaScene.style.setProperty("--argentina-opacity", String(argentinaOpacity));
          argentinaScene.style.setProperty("--argentina-copy-y", `${argentina.copyY}px`);
          argentinaWords.forEach((word, index) => {
            word.style.setProperty("--argentina-word-opacity", String(getArgentinaWordOpacity(argentina.reading, index, argentinaWords.length)));
          });
          argentinaPhotos.forEach((photo, index) => {
            photo.style.setProperty("--argentina-photo-y", `${argentina.photoY[index]}%`);
            photo.setAttribute("aria-hidden", String(index !== argentina.activePhoto));
          });
        }
        // A growing circle at the lower-left corner sweeps towards the upper-right.
        // There is no timed entrance: without scrolling, the title stays concealed.
        const reveal = ease(phase(progress, .008, .20));
        // Hold for a physical scroll distance, independent of viewport height.
        const exitStart = .20 + TITLE_HOLD_PX / distance;
        const retreat = 1 - ease(phase(progress, exitStart, exitStart + .09));
        title.style.setProperty("--title-radius", `${titleRadius * reveal * retreat}px`);
        statementScene.style.visibility = progress < .49 || mountainFrame?.covered ? "hidden" : "visible";
        root.style.setProperty("--hint-opacity", String(1 - phase(progress, 0, .06)));
        const sunrise = ease(phase(progress, .30, .53));
        root.style.setProperty("--sun-y", `${(1 - sunrise) * 120}svh`);
        root.style.setProperty("--sun-opacity", String(phase(progress, .20, .28)));
        root.style.setProperty("--statement-opacity", String(phase(progress, .49, .55)));
        const fill = phase(progress, .66, .90);
        let offset = 0;
        words.forEach((word) => {
          const wordLength = word.dataset.text?.length ?? 0;
          const reveal = clamp((fill * content.statement.length - offset) / Math.max(1, wordLength));
          word.style.setProperty("--word-fill", `${reveal * 100}%`);
          offset += wordLength + 1;
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      const measure = () => {
        top = root.getBoundingClientRect().top + window.scrollY;
        const stage = root.querySelector<HTMLElement>("[data-stage-frame]")!;
        viewportHeight = stage.clientHeight;
        // Never derive Part A's progress from the extended A+B story height.
        distance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-a]")!.offsetHeight);
        mountainDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-b]")!.offsetHeight);
        missionDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-b1]")!.offsetHeight);
        vegetationDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-c]")!.offsetHeight);
        argentinaDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-c1]")!.offsetHeight);
        projectsDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-d]")!.offsetHeight);
        impactDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-e]")!.offsetHeight);
        aboutDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-f]")!.offsetHeight);
        donationDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-g]")!.offsetHeight);
        contactDistance = Math.max(1, root.querySelector<HTMLElement>("[data-distance-h]")?.offsetHeight ?? 0);
        contactOverflow = Math.max(0, (contactContent?.offsetHeight ?? 0) - stage.clientHeight);
        root.style.setProperty("--contact-reading-distance", `${partH ? contactOverflow + stage.clientHeight * .5 : 0}px`);
        impactCopyHeight = impactCopy?.offsetHeight ?? 0;
        aboutContentOverflow = Math.max(0, (aboutCopy?.offsetHeight ?? 0) - stage.clientHeight);
        aboutReadingDistance = partF ? aboutContentOverflow + stage.clientHeight * .75 : 0;
        root.style.setProperty("--about-reading-distance", `${aboutReadingDistance}px`);
        donationOverflow = Math.max(0, (donationContent?.offsetHeight ?? 0) - stage.clientHeight);
        donationReadingDistance = partG ? donationOverflow + stage.clientHeight * .5 : 0;
        root.style.setProperty("--donation-reading-distance", `${donationReadingDistance}px`);
        if (partC) {
          vegetationGeometry = getVegetationGeometry(stage.clientWidth, stage.clientHeight, partC.vegetation);
          vegetation.forEach((element, index) => {
            element.style.setProperty("--vegetation-width", `${vegetationGeometry[index].width}px`);
          });
        }
        vegetationTravel = partD && partC ? measureVegetationPinTravel(stage.clientWidth, stage.clientHeight, vegetationGeometry, vegetationImages) : 0;
        root.style.setProperty("--vegetation-travel", `${vegetationTravel}px`);
        root.style.setProperty("--vegetation-release-top", `${distance + mountainDistance + missionDistance + vegetationDistance + argentinaDistance + projectsDistance * .05}px`);
        if (partD) {
          const vegetationBottom = partC && vegetationGeometry.length
            ? Math.max(...vegetationGeometry.map((layer, index) => layer.y + layer.width * partC.vegetation[index].height / partC.vegetation[index].width))
            : undefined;
          projectsGeometry = getProjectsGeometry(stage.clientWidth, stage.clientHeight, partD, vegetationBottom);
          const place = (element: HTMLElement | null, geometry: { x: number; y: number; width: number }) => {
            element?.style.setProperty("--asset-x", `${geometry.x}px`);
            element?.style.setProperty("--asset-y", `${geometry.y}px`);
            element?.style.setProperty("--asset-width", `${geometry.width}px`);
          };
          projectTrees.forEach((tree, index) => place(tree, projectsGeometry!.trees[index]));
          place(projectWay, projectsGeometry.way);
          place(projectChurch, projectsGeometry.church);
          if (projectsGeometry.vegetationPath) {
            place(projectVegetation, projectsGeometry.vegetationPath);
            projectVegetation?.style.setProperty("--vegetation-blend", `${projectsGeometry.vegetationPath.blend}px`);
          }
          if (partE) {
            impactGeometry = getImpactGeometry(stage.clientWidth, stage.clientHeight, projectsGeometry, partE.houses);
            houses.forEach((house, i) => place(house, impactGeometry!.houses[i]));
            if (partF) {
              aboutGeometry = getAboutGeometry(stage.clientWidth, stage.clientHeight, projectsGeometry, impactGeometry, partF);
              place(aboutHouse, aboutGeometry.house);
              aboutGrains.forEach((grain, i) => place(grain, aboutGeometry!.grains[i]));
              if (partG) {
                donationGeometry = getDonationGeometry(stage.clientWidth, stage.clientHeight, aboutGeometry, aboutContentOverflow, partG);
                cocoaTrees.forEach((tree, i) => place(tree, donationGeometry!.trees[i]));
                place(cocoaGrains, donationGeometry.grains);
                if (partH) {
                  contactGeometry = getContactGeometry(stage.clientWidth, stage.clientHeight, donationGeometry, partH.grains);
                  contactGrains.forEach((grain, i) => place(grain, contactGeometry!.grains[i]));
                }
              }
            }
          }
        }
        argentinaTextHeight = argentinaParagraph?.offsetHeight ?? 0;
        argentinaWindowHeight = argentinaWindow?.clientHeight ?? 0;
        if (missionCopy && missionTitle) {
          const stacked = window.matchMedia("(max-width: 900px)").matches;
          const titleHeight = missionTitle.offsetHeight * .85;
          const copyHeight = missionCopy.offsetHeight;
          const gap = 24;
          const groupHeight = titleHeight + gap + copyHeight;
          const groupTop = Math.max(24, (stage.clientHeight - groupHeight) / 2);
          root.style.setProperty("--mission-dock-top", stacked ? `${groupTop + titleHeight / 2}px` : "50svh");
          root.style.setProperty("--mission-copy-top", stacked ? `${groupTop + titleHeight + gap + copyHeight / 2}px` : "50svh");
        }
        if (partB?.mountains[0]) {
          const first = partB.mountains[0];
          const layer = MOUNTAIN_LAYERS[0];
          const width = Math.max(stage.clientWidth * layer.width, stage.clientHeight * layer.minWidthVh);
          firstMountainHeightVh = width * first.height / first.width / stage.clientHeight * 100;
        }
        titleRadius = Math.hypot(title.offsetWidth, title.offsetHeight) + 2;
        crossingClouds.forEach((cloud, index) => {
          const width = cloud.offsetWidth;
          const viewportWidth = window.innerWidth;
          const mobile = window.matchMedia("(max-width: 700px)").matches;
          // Match the previous average px/s, despite the longer offscreen route.
          const previousDistance = mobile
            ? viewportWidth * (index === 0 ? .78 : .82)
            : viewportWidth * (index === 0 ? 1.14 : 1.12) - width;
          const crossingDistance = stage.clientWidth + width + 4;
          cloud.style.setProperty("--crossing-end", `${stage.clientWidth + 2}px`);
          const previousSeconds = index === 0 ? 20.429 : 25.103;
          cloud.style.setProperty("--crossing-duration", `${previousSeconds * crossingDistance / Math.max(1, previousDistance)}s`);
        });
        schedule();
      };
      const visibility = () => {
        root.dataset.inactive = String(document.hidden || !inView);
        if (!document.hidden && inView) schedule();
      };
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); });
      root.dataset.enhanced = "true";
      if (projectsScene) projectsScene.dataset.enhanced = "true";
      if (impactScene) impactScene.dataset.enhanced = "true";
      if (aboutScene) aboutScene.dataset.enhanced = "true";
      if (donationScene) donationScene.dataset.enhanced = "true";
      if (contactScene) contactScene.dataset.enhanced = "true";
      measure();
      observer.observe(root);
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(root);
      resizeObserver.observe(title);
      if (missionCopy) resizeObserver.observe(missionCopy);
      if (missionTitle) resizeObserver.observe(missionTitle);
      if (argentinaParagraph) resizeObserver.observe(argentinaParagraph);
      if (argentinaWindow) resizeObserver.observe(argentinaWindow);
      if (aboutCopy) resizeObserver.observe(aboutCopy);
      if (donationContent) resizeObserver.observe(donationContent);
      if (contactContent) resizeObserver.observe(contactContent);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", measure);
      vegetationImages.forEach(image => image.addEventListener("load", measure));
      document.addEventListener("visibilitychange", visibility);
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", measure);
        vegetationImages.forEach(image => image.removeEventListener("load", measure));
        document.removeEventListener("visibilitychange", visibility);
        delete root.dataset.enhanced;
        delete root.dataset.donationBackdropVisible;
        delete root.dataset.inactive;
        delete root.dataset.mountains;
        delete root.dataset.covered;
        delete root.dataset.missionCopy;
        root.style.removeProperty("--part-d-background-y");
        root.style.removeProperty("--impact-blur");
        root.style.removeProperty("--about-reading-distance");
        root.style.removeProperty("--donation-reading-distance");
        root.style.removeProperty("--donation-blur");
        root.style.removeProperty("--contact-reading-distance");
        if (contactContent) contactContent.inert = false;
        if (contactAction) contactAction.inert = false;
        if (contactScene) {
          ["enhanced", "visible", "copyVisible", "ctaVisible"].forEach(key => delete contactScene.dataset[key]);
          contactScene.removeAttribute("style");
        }
        [...contactGrains, ...contactLetters].forEach(element => {
          element.removeAttribute("style");
          delete element.dataset.visible;
        });
        if (donationCta) donationCta.inert = false;
        if (donationScene) {
          ["enhanced", "visible", "ctaVisible"].forEach(key => delete donationScene.dataset[key]);
          donationScene.removeAttribute("style");
        }
        [...cocoaTrees, cocoaGrains].forEach(element => {
          element?.removeAttribute("style");
          if (element) delete element.dataset.visible;
        });
        if (impactCopy) impactCopy.inert = false;
        if (impactAction) impactAction.inert = false;
        [aboutCopy, aboutAction, aboutGallery].forEach(element => { if (element) element.inert = false; });
        if (aboutScene) {
          ["enhanced", "visible", "copyVisible", "ctaVisible", "galleryVisible"].forEach(key => delete aboutScene.dataset[key]);
          aboutScene.removeAttribute("style");
        }
        [aboutHouse, ...aboutGrains, ...aboutLetters].forEach(element => {
          if (!element) return;
          element.removeAttribute("style");
          delete element.dataset.visible;
        });
        if (impactScene) {
          ["enhanced", "visible", "copyVisible", "interactive"].forEach(key => delete impactScene.dataset[key]);
          impactScene.removeAttribute("style");
        }
        [...houses, ...impactLetters, ...impactLines].forEach(element => {
          element.removeAttribute("style");
          delete element.dataset.visible;
        });
        delete root.dataset.vegetationPin;
        root.style.removeProperty("--vegetation-travel");
        root.style.removeProperty("--vegetation-release-top");
        if (missionCopy) missionCopy.inert = false;
        if (argentinaScene) {
          argentinaScene.inert = false;
          delete argentinaScene.dataset.visible;
          delete argentinaScene.dataset.ctaVisible;
          argentinaScene.style.removeProperty("--argentina-cta-opacity");
          ["--argentina-rise", "--argentina-opacity", "--argentina-copy-y"].forEach(property => argentinaScene.style.removeProperty(property));
        }
        argentinaWords.forEach(word => word.style.removeProperty("--argentina-word-opacity"));
        argentinaPhotos.forEach(photo => {
          photo.style.removeProperty("--argentina-photo-y");
          photo.removeAttribute("aria-hidden");
        });
        if (projectsScene) {
          ["enhanced", "visible", "projectsVisible", "interactive"].forEach(key => delete projectsScene.dataset[key]);
          ["--projects-pan", "--projects-opacity"].forEach(property => projectsScene.style.removeProperty(property));
        }
        if (projectsContent) projectsContent.inert = false;
        [...projectTrees, projectWay, projectChurch, projectVegetation].forEach(element => {
          if (!element) return;
          delete element.dataset.visible;
          ["--asset-x", "--asset-y", "--asset-width", "--tree-rise", "--way-hidden", "--church-rise", "--vegetation-blend"].forEach(property => element.style.removeProperty(property));
        });
        vegetation.forEach(element => {
          delete element.dataset.visible;
          ["--vegetation-x", "--vegetation-y", "--vegetation-width"].forEach(property => element.style.removeProperty(property));
        });
        title.style.removeProperty("--title-radius");
        crossingClouds.forEach((cloud) => {
          cloud.style.removeProperty("--crossing-duration");
          cloud.style.removeProperty("--crossing-end");
        });
        statementScene.style.removeProperty("visibility");
      };
    };
    setup();
    motionPreference.addEventListener("change", setup);
    return () => { dispose(); motionPreference.removeEventListener("change", setup); };
  }, [content.statement, partB, partC, partC1, partD, partE, partF, partG, partH]);

  return (
    <main className={styles.story} ref={rootRef} lang={locale} data-has-part-b={partB ? "true" : undefined} data-has-part-b1={partB?.description ? "true" : undefined} data-has-part-c={partC ? "true" : undefined} data-has-part-c1={partC1 ? "true" : undefined} data-has-part-d={partD ? "true" : undefined} data-has-part-e={partE && partD ? "true" : undefined} data-has-part-f={partD && partE && partF ? "true" : undefined} data-has-part-h={partD && partE && partF && partG && partH ? "true" : undefined}>
      <noscript><style>{`[data-story-title] { clip-path: none !important; }`}</style></noscript>
      {partD && partE && partF && partG && <div className={`${styles.scrollMeasure} ${styles.distanceG}`} data-distance-g aria-hidden="true" />}
      {!partG && <div className={styles.scrollMeasure} data-distance-g aria-hidden="true" />}
      {partD && partE && partF && partG && partH && <div className={`${styles.scrollMeasure} ${styles.distanceH}`} data-distance-h aria-hidden="true" />}
      <div className={`${styles.scrollMeasure} ${styles.distanceA}`} data-distance-a aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceB}`} data-distance-b aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceB1}`} data-distance-b1 aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceC}`} data-distance-c aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceC1}`} data-distance-c1 aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceD}`} data-distance-d aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceE}`} data-distance-e aria-hidden="true" />
      <div className={`${styles.scrollMeasure} ${styles.distanceF}`} data-distance-f aria-hidden="true" />
      <div className={styles.stage} data-stage>
       <div className={styles.stageFrame} data-stage-frame>
        <div className={styles.sun} aria-hidden="true">
          <Image className={styles.sunImage} src={content.images.sun} alt="" width={940} height={940} sizes="(max-width: 700px) 86vw, 940px" loading="eager" />
        </div>
        <div className={styles.clouds} aria-hidden="true">
          {content.images.clouds.map((src, index) => (
            <div className={`${styles.cloud} ${styles[`cloud${index + 1}`]}`} data-crossing-cloud={index < 2 ? "true" : undefined} key={src}>
              <Image src={src} alt="" width={[1250, 1170, 1180][index]} height={[799, 600, 680][index]} sizes="(max-width: 700px) 58vw, 36vw" loading="eager" />
            </div>
          ))}
        </div>
        <div className={styles.titleScene}>
          <h1 className={styles.title} data-story-title aria-label={content.titleLines.join(" ")}>
            {content.titleLines.map((line) => (
              <span className={styles.titleLine} key={line} aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.statementScene} data-statement-scene>
          <h2 className={styles.statement} aria-label={content.statement}>
            {content.statement.split(" ").map((word, index) => (
              <span className={styles.word} data-word data-text={word} aria-hidden="true" key={`${word}-${index}`}>{word}{" "}</span>
            ))}
          </h2>
        </div>
        <p className={styles.scrollHint}>{content.scrollLabel}<span aria-hidden="true">↓</span></p>
        {partB && (
          <section className={styles.mountainScene} aria-labelledby="home-mission-title">
            <div className={styles.landscape}>
              <div className={styles.camera}>
                {partB.mountains.map((mountain, index) => {
                  const layer = MOUNTAIN_LAYERS[index];
                  if (!layer) return null;
                  return (
                    <div className={styles.mountain} data-mountain={index + 1} aria-hidden="true" key={mountain.src} style={{
                      zIndex: (index + 1) * 10,
                      "--mountain-width": `${layer.width * 100}%`,
                      "--mountain-min-width": `${layer.minWidthVh * 100}svh`,
                      "--mountain-shift": `${layer.shift * 100}vw`,
                      "--mountain-rest-y": `${layer.missionTop * 100}svh`,
                    } as CSSProperties}>
                      <Image src={mountain.src} alt="" width={mountain.width} height={mountain.height}
                        sizes="(max-aspect-ratio: 1/1) 197vh, 120vw" loading="eager" />
                    </div>
                  );
                })}
                <div className={styles.missionScene}>
                  <h2 id="home-mission-title" className={styles.missionTitle} data-mission-title>{partB.title}</h2>
                </div>
                {partB.description && (
                  <div className={styles.missionCopy} data-mission-copy>
                    <p>{partB.description}</p>
                    {partB.cta && <ButtonLink href={partB.cta.href} variant="secondary">{partB.cta.label}</ButtonLink>}
                  </div>
                )}
                {partC?.vegetation.map((asset, index) => (
                  <div className={styles.vegetation} data-vegetation={index + 1} aria-hidden="true" key={asset.src}
                    style={{ zIndex: VEGETATION_LAYERS[index].zIndex }}>
                    <Image src={asset.src} alt="" width={asset.width} height={asset.height}
                      sizes="(max-aspect-ratio: 1/1) 170vh, 134vw" loading="eager" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {partC1 && <ArgentinaScene content={partC1} />}
        {partD && partE && partF && partG?.background && <div className={styles.donationBackdrop} data-donation-backdrop aria-hidden="true">
          <Image {...partG.background} alt="" unoptimized loading="eager" />
        </div>}
        {partD && <ProjectsScene content={partD} />}
        {partD && partE && <ImpactScene content={partE} />}
        {partD && partE && partF && <AboutScene content={partF} />}
        {partD && partE && partF && partG && <DonationScene content={partG} locale={locale} />}
        {partD && partE && partF && partG && partH && <ContactScene content={partH} />}
       </div>
      </div>
    </main>
  );
}
