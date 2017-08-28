import { PsradminClientPage } from './app.po';

describe('psradmin-client App', function() {
  let page: PsradminClientPage;

  beforeEach(() => {
    page = new PsradminClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
