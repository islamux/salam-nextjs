// Footer component

import { useTranslation } from '@/hooks/useTranslation';
import GithubIcon from './GithubIcon';
import MailIcons from './MailIcon';

export default function Footer() {
  const { footer } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="arabic-title text-xl font-semibold mb-4">
            {footer.bookName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {footer.tagline}
          </p>
          <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-500">
            <span>{footer.copyright}</span>
            <span>•</span>
            <span>{footer.rightsReserved}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {footer.builtWith}
            </p>
            {/*Github*/}
            <div className='flex justify-center items-center gap-3 text-sm text-gray-500 dark:text-gray-400'>
              <span>{footer.developedBy}</span>
              <div className='flex items-center gap-3'>
                <a
                  href='https://github.com/islamux/salam-nextjs'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-gray-900 dark:hover:text-white transition-colors'
                  aria-label='GitHub'>
                  <GithubIcon className='w-5 h-5' />
                </a>
                {/*Email*/}
                <a
                  href='mailto:fathi733@gmail.com'
                  className='hover:text-gray-900 dark:hover:text-white transition-colors'
                  aria-label='Email'
                >
                  <MailIcons className="w-5 h-5" />
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
