import React, {createContext, useCallback, Dispatch, setStateAction} from 'react';
import TranslatorFactory from './helpers/translator-factory';
import {TranslationHandler, CacheProvider} from './types';

const defaultHandler: TranslationHandler = () => {};

export const TranslateContext: React.Context<
  TranslationHandler
> = createContext(defaultHandler);
export const LanguageContext: React.Context<string> = createContext('en');

type Props = {
  to: string;
  from: string;
  cacheProvider?: CacheProvider;
  children: string;
  googleApiKey: string;
  loading: string;
  setLoading: Dispatch<setStateAction<boolean>>;
};

export default function Translator({
  to,
  from,
  cacheProvider,
  children,
  googleApiKey,
  loading,
  setLoading
}: Props): JSX.Element {
  const handleTranslationAsync: TranslationHandler = useCallback(
    async (value, setTranslation) => {
      setLoading(true);
      const options = {
        to,
        from,
        apiKey: googleApiKey,
      };
      const translator = TranslatorFactory.create(options, cacheProvider);
      const translation = await translator.translate(value);

      if (translation) {
        setTranslation(translation);
        setLoading(false)
      }
    },
    [to, from, googleApiKey, cacheProvider, loading]
  );

  return (
    <TranslateContext.Provider value={handleTranslationAsync}>
      <LanguageContext.Provider value={to}>
        {children}
        </LanguageContext.Provider>
    </TranslateContext.Provider>
  );
}
