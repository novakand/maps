import { LanguageName } from '../../enums/language-name.enum';
import { LanguageCode } from '../../enums/language-service.enum';

export class YandexLanguageDictionary {

  public language = [
    { code: LanguageCode.ru, name: LanguageName.ru },
    { code: LanguageCode.uk, name: LanguageName.uk },
    { code: LanguageCode.tr, name: LanguageName.tr },
    { code: LanguageCode.en, name: LanguageName.en },
  ];

}
