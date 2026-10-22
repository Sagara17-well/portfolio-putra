"use client";
import Link from "next/link";
import { useState } from "react";
import Nav from "./Nav";
import IdCard from "./IdCard";
import Music from "./Music";
import Writeups from "./Writeups";
import type { WriteupMeta } from "@/lib/writeups";
import Socials from "./Socials";
import ContactForm from "./ContactForm";
import { showMusic } from "@/lib/social";
import Clock from "./Clock";
import Quote from "./Quote";
import Projects from "./Projects";
import { useSite } from "./Providers";
import AnimatedContent from "./react-bits/AnimatedContent";
import BlurText from "./react-bits/BlurText";
import CountUp from "./react-bits/CountUp";
import DecryptedText from "./react-bits/DecryptedText";
import NetworkField from "./react-bits/NetworkField";
import FadeContent from "./react-bits/FadeContent";
import GlareHover from "./react-bits/GlareHover";
import Magnet from "./react-bits/Magnet";
import Radar from "./react-bits/Radar";
import RotatingText from "./react-bits/RotatingText";
import ScrollFloat from "./react-bits/ScrollFloat";
import TextType from "./react-bits/TextType";
import { certs, education, experience, learning, profile, projects, radar, roles, stack } from "@/data/content";
import { ui } from "@/data/ui";
import { openPalette, copyText, toast } from "@/lib/toast";

const toolCount = stack.reduce((n, g) => n + g.items.length, 0);
const wrap = "mx-auto w-full max-w-6xl px-5";
const h2 = "font-display text-[clamp(30px,4.6vw,48px)] font-extrabold leading-tight tracking-tight";

function Head({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div>
      <p className="mb-4 inline-block rounded-full border border-current px-3 py-0.5 font-mono text-[13px] text-accent">{n} /</p>
      <h2 className={h2}><BlurText text={title} /></h2>
      {sub && <p className="mt-5 max-w-[60ch] text-muted">{sub}</p>}
    </div>
  );
}

export default function Site({ writeups = [] }: { writeups?: WriteupMeta[] }) {
  const { t } = useSite();
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    if (await copyText(profile.email)) { setCopied(true); toast(t(ui.contact.copied)); setTimeout(() => setCopied(false), 2000); }
    else toast(profile.email);
  };
  const resolvedRoles = roles.map((r) => t(r));
  const radarData = radar.map((r) => ({ label: t(r.label), value: r.value }));
  let n = 1;
  const num = () => String(n++).padStart(2, "0");

  return (
    <>
      <Nav />
      <main id="main">
        {/* HERO */}
        <header id="top" className="relative flex min-h-screen items-end overflow-hidden pb-16 pt-32">
          <NetworkField />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_100%,var(--bg),transparent)]" />
          <div className={`${wrap} relative grid items-end gap-14 lg:grid-cols-[1fr_auto]`}>
            <div>
              <p className="mb-6 font-mono text-sm text-accent">
                <TextType texts={ui.hero.typing.map((x, i) => (i === 0 ? `${x} -- ${profile.city}` : x))} />
              </p>
              <h1 className="font-display text-[clamp(48px,8.6vw,128px)] font-extrabold leading-[.9] tracking-tighter">
                <BlurText text={profile.name[0]} className="block" />
                <BlurText text={profile.name[1]} delay={120} className="outline-text block" />
              </h1>
              <p className="mt-8 text-[clamp(20px,2.4vw,28px)] leading-snug">
                {t(ui.hero.iam)} <RotatingText items={resolvedRoles} className="font-medium text-accent" />
              </p>
              <p className="mt-4 max-w-[52ch] text-muted">{t(profile.lead)}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnet><a href="#projects" className="block rounded-full bg-ink px-7 py-3 font-medium text-bg">{t(ui.hero.seeProjects)}</a></Magnet>
                <Magnet><a href="#lab" className="block rounded-full border border-line px-7 py-3 font-medium hover:border-accent">{t(ui.hero.tryLab)}</a></Magnet>
                <a href="/cv?print=1" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-mono text-sm text-muted transition-colors hover:text-ink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" /></svg>
                  {t(ui.hero.cv)}
                </a>
              </div>
              <p className="mt-8 hidden font-mono text-[13px] text-muted sm:block">
                {t(ui.hero.hint)} <kbd>Ctrl</kbd> + <kbd>K</kbd> {t(ui.hero.hintEnd)}
              </p>
              <button type="button" onClick={openPalette} className="mt-6 font-mono text-[13px] text-muted underline-offset-4 hover:underline sm:hidden">
                &gt; {t(ui.ctl.palette)}
              </button>
            </div>
            <div className="relative mx-auto w-full max-w-[290px] pb-2 lg:mx-0">
              <IdCard />
            </div>
          </div>
        </header>

        {/* TENTANG */}
        <div className="skin">
        <section id="about" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <p className="mb-4 inline-block rounded-full border border-current px-3 py-0.5 font-mono text-[13px] text-accent">{num()} /</p>
          <h2 className={h2}><ScrollFloat text={t(ui.about.title)} /></h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div>
              <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink/90 md:text-[19px]">{t(profile.about)}</p>
              <p className="mt-5 font-mono text-[13px] text-muted">{profile.campus}, {t(ui.about.major)}</p>
              <Quote />
            </div>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {([[projects.length, ui.about.stats[0]], [toolCount, ui.about.stats[1]], [2, ui.about.stats[2]]] as const).map(([v, label]) => (
                <div key={label.en} className="rounded-2xl border border-line bg-panel p-4 lg:flex lg:items-baseline lg:justify-between lg:px-6 lg:py-5">
                  <div className="font-display text-3xl font-extrabold"><CountUp to={v} /></div>
                  <div className="mt-1 text-[14px] text-muted lg:mt-0 lg:text-[15px]">{t(label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>

        {/* PENDIDIKAN */}
        <div className="skin skin-soft">
        <section id="education" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <Head n={num()} title={t(ui.edu.title)} sub={t(ui.edu.sub)} />
              <div className="mt-6 flex flex-wrap gap-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[13px] text-accent">
                  <span aria-hidden="true">🎓</span>{t(ui.edu.chip)}
                </p>
                <p className="inline-flex items-center rounded-full border border-line px-3 py-1 font-mono text-[13px] text-muted">{t(ui.edu.batch)}</p>
              </div>
            </div>
            <ol>
              {education.map((e, i) => (
                <li key={e.school} className="relative pb-5 pl-16 last:pb-0">
                  {i < education.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[21px] top-14 w-px bg-line" />}
                  <span className={`absolute left-0 top-3 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[13px] ${e.current ? "border-accent bg-accent text-on-accent" : "border-line bg-panel text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <FadeContent delay={i * 0.08}>
                    <article className={`rounded-2xl border bg-panel p-5 ${e.current ? "border-accent" : "border-line"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-mono text-[13px] text-accent">{t(e.level)}</p>
                        {e.current
                          ? <span className="rounded-full bg-accent px-3 py-0.5 font-mono text-[12px] font-semibold text-on-accent">{t(ui.edu.now)}</span>
                          : <span className="font-mono text-[13px] text-muted">{t(e.years)}</span>}
                      </div>
                      <h3 className="mt-2 font-display text-xl font-extrabold md:text-2xl">{e.school}</h3>
                      {e.current && <p className="mt-1.5 text-muted">{[e.detail ? t(e.detail) : "", t(e.years)].filter(Boolean).join(" · ")}</p>}
                    </article>
                  </FadeContent>
                </li>
              ))}
            </ol>
          </div>
        </section>
        </div>

        {/* PROYEK */}
        <div className="skin skin-soft">
        <section id="skills" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.skills.title)} />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center"><Radar data={radarData} /></div>
            <div className="space-y-8">
              {stack.map((g) => (
                <div key={g.group.en}>
                  <h3 className="mb-4 inline-block rounded-full border border-current px-3 py-0.5 font-mono text-[13px] text-accent">{t(g.group)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((x) => (
                      <span key={x} className="rounded-full border border-line bg-panel px-4 py-1.5 text-[15px]">{x}</span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted">{t(ui.skills.note)}</p>
            </div>
          </div>
        </section>
        </div>
        <div className="skin">
        <section id="projects" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.projects.title)} sub={t(ui.projects.sub)} />
          <Projects />
        </section>
        </div>
        <div className="skin skin-soft">
          <section id="writeups" className={`${wrap} py-16 md:py-24 lg:py-28`}>
            <Head n={num()} title={t(ui.writeups.title)} sub={t(ui.writeups.sub)} />
            <Writeups items={writeups} />
          </section>
        </div>

        {/* LAB */}
        <div className="skin">
        <section id="lab" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.lab.title)} sub={t(ui.labTeaser.sub)} />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {ui.labTeaser.items.map((it) => (
              <li key={it.title.en}>
                <Link href="/lab" className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent">
                  <h3 className="text-xl font-extrabold group-hover:text-accent">{t(it.title)}</h3>
                  <p className="mt-2 text-[16px] text-muted">{t(it.desc)}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/lab" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-strong px-6 py-3 font-semibold text-on-accent transition-opacity hover:opacity-90">
            {t(ui.labTeaser.open)} <span aria-hidden>&rarr;</span>
          </Link>
        </section>
        </div>

        {/* SKILL */}

        {/* PENGALAMAN */}
        <div className="skin skin-soft">
        <section id="experience" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.exp.title)} />
          <ol className="mt-12 border-l border-line">
            {experience.map((e, i) => (
              <li key={e.title.en} className="relative pb-12 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-2.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <FadeContent delay={i * 0.1}>
                  <p className="font-mono text-sm text-muted">{t(e.when)}</p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold">{t(e.title)}</h3>
                  <p className="text-accent">{typeof e.org === "string" ? e.org : t(e.org)}</p>
                  <p className="mt-2 max-w-[60ch] text-muted">{t(e.desc)}</p>
                </FadeContent>
              </li>
            ))}
          </ol>
        </section>
        </div>

        {/* BELAJAR */}
        <div className="skin">
        <section id="learning" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.learning.title)} sub={t(ui.learning.sub)} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {learning.map((x, i) => (
              <AnimatedContent key={x.topic.en} delay={i * 0.08}>
                <article className="h-full rounded-2xl border border-line bg-panel p-6">
                  <p className="font-mono text-[13px] text-accent">$ learn --now</p>
                  <h3 className="mt-3 font-display text-xl font-extrabold leading-snug">{t(x.topic)}</h3>
                  <p className="mt-2 text-[16px] text-muted">{t(x.note)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {x.tags.map((tg) => <span key={tg} className="rounded-full border border-line px-3 py-0.5 font-mono text-[13px]">{tg}</span>)}
                  </div>
                </article>
              </AnimatedContent>
            ))}
          </div>
        </section>
        </div>

        {/* SERTIFIKAT (selalu tampil; kosong = pesan) */}
        {(
          <div className="skin skin-soft">
          <section id="certificates" className={`${wrap} py-16 md:py-24 lg:py-28`}>
            <Head n={num()} title={t(ui.certs.title)} />
            {certs.length === 0 && (
              <p className="mt-12 rounded-2xl border border-dashed border-line bg-panel p-8 text-muted">{t(ui.certs.empty)}</p>
            )}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c, i) => (
                <AnimatedContent key={c.title} delay={(i % 3) * 0.1}>
                  <GlareHover className="rounded-2xl border border-line bg-panel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={c.title} loading="lazy" className="block aspect-[1200/850] w-full object-cover" />
                    <div className="flex items-baseline justify-between gap-3 border-t border-line p-4">
                      <div>
                        <h3 className="font-medium leading-snug">{c.title}</h3>
                        <p className="text-sm text-muted">{c.by}</p>
                      </div>
                      <span className="font-mono text-sm text-accent">{c.year}</span>
                    </div>
                  </GlareHover>
                </AnimatedContent>
              ))}
            </div>
          </section>
          </div>
        )}

        {/* MUSIK */}
        {showMusic && (
          <div className="skin">
        <section id="music" className={`${wrap} py-16 md:py-24 lg:py-28`}>
          <Head n={num()} title={t(ui.music.title)} sub={t(ui.music.sub)} />
          <Music />
        </section>
        </div>
        )}

        {/* KONTAK */}
        <section id="contact" className="relative border-t border-line py-20 md:py-28 lg:py-32">
          <div className={`${wrap} relative text-center`}>
            <h2 className="font-display text-[clamp(48px,10vw,128px)] font-extrabold leading-none tracking-tighter">
              <ScrollFloat text={t(ui.contact.title)} />
            </h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-muted">{t(ui.contact.sub)}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnet>
                <a href={`mailto:${profile.email}`} className="block rounded-full border border-accent px-8 py-4 font-mono text-[clamp(15px,3.6vw,22px)] transition-colors hover:bg-accent-strong hover:text-on-accent">
                  <DecryptedText text={profile.email} />
                </a>
              </Magnet>
              <button type="button" onClick={copyEmail} className="rounded-full border border-line px-5 py-4 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-ink">
                {copied ? `✓ ${t(ui.contact.copied)}` : t(ui.contact.copy)}
              </button>
            </div>
            <ContactForm />
            <p className="mb-4 mt-14 font-mono text-[13px] text-muted">{t(ui.contact.social)}</p>
            <Socials />
            <Clock place={profile.city} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="border-t border-line py-10 print:hidden">
      <div className={`${wrap} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
        <div>
          <p className="font-mono text-[13px] text-accent">{t(ui.footer.proof)}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ui.footer.badges.map((b) => (
              <li key={b.en} className="rounded-full border border-line px-3 py-1 font-mono text-[13px] text-muted"><span className="mr-1.5 text-ok">&#10003;</span>{t(b)}</li>
            ))}
          </ul>
          <a href="https://securityheaders.com" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-[13px] text-muted underline decoration-accent underline-offset-4 hover:text-ink">
            {t(ui.footer.test)} &#8599;
          </a>
          <Link href="/security" className="ml-4 mt-3 inline-block font-mono text-[13px] text-muted underline decoration-accent underline-offset-4 hover:text-ink">{t(ui.footer.security)}</Link>
        </div>
        <div className="font-mono text-sm text-muted md:text-right">
          <p>{profile.name.join(" ")} &copy; 2026</p>
          <p className="mt-1">{t(ui.footer.built)}</p>
          <div className="mt-4 md:flex md:justify-end"><Socials variant="icons" /></div>
          <a href="#top" className="mt-2 inline-block text-ink underline decoration-accent underline-offset-4">{t(ui.footer.top)} &uarr;</a>
        </div>
      </div>
    </footer>
  );
}
