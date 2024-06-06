import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { SiteData } from './types';

export class HyperlinkInlineCard extends LitElement {
  @property({ type: String })
  href = '';

  @property({ type: String })
  target: '_blank' | '_self' = '_self';

  @state()
  siteData?: SiteData;

  @state()
  loading = false;

  override connectedCallback() {
    super.connectedCallback();
    this.fetchSiteData();
  }

  async fetchSiteData() {
    // Mock
    try {
      this.loading = true;
      const response = await fetch(
        `/apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=${this.href}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch site data');
      }

      this.siteData = (await response.json()) as SiteData;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  override render() {
    const fallback = html`<a class="text-indigo-600" href=${this.href} target=${this.target}>
      ${this.href}
    </a>`;

    if (this.loading) {
      return fallback;
    }

    if (this.siteData) {
      return html`<a
        class="inline-flex items-center group space-x-1.5 px-1.5 text-inline-title bg-hover-inline-card text-[90%] rounded bg-inline-card transition-all mx-1 py-0.5"
        href=${this.href}
        target=${this.target}
      >
        ${!!this.siteData.icon || !!this.siteData.image
          ? html`<img
              class="size-4 rounded-sm"
              src=${this.siteData.icon || this.siteData.image || ''}
            />`
          : ''}
        <span>${this.siteData.title || this.href}</span>
        ${!this.href.startsWith(location.origin)
          ? html` <span class="i-tabler-external-link text-inline-title"></span>`
          : ''}
      </a>`;
    }

    return fallback;
  }

  static override styles = [
    unsafeCSS(resetStyles),
    css`
      :host {
        display: inline-block;
        vertical-align: middle;
      }
      @unocss-placeholder;
    `,
  ];
}

customElements.get('hyperlink-inline-card') ||
  customElements.define('hyperlink-inline-card', HyperlinkInlineCard);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-inline-card': HyperlinkInlineCard;
  }
}
