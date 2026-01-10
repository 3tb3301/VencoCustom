/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const OWNER_ID = "298055455614173184";

const settings = definePluginSettings({
    badgeIcon: {
        type: OptionType.STRING,
        description: "Badge icon URL (PNG/SVG/GIF)",
        default: "https://g.top4top.io/p_36628weww1.png"
    },
    badgeSize: {
        type: OptionType.SLIDER,
        description: "Badge size",
        default: 22,
        markers: [18, 20, 22, 24, 26, 28],
        stickToMarkers: true
    },
    showTooltip: {
        type: OptionType.BOOLEAN,
        description: "Show plugins list on hover",
        default: true
    },
    tooltipTitle: {
        type: OptionType.STRING,
        description: "Tooltip title",
        default: "3Tb's Plugins"
    }
});

const MY_PLUGINS = [
    { name: "PullUser", desc: "Drag users with you across voice channels" },
    { name: "FollowUser", desc: "Always be in the same VC as someone" },
    { name: "VoiceChannelBlacklist", desc: "Block users from voice channels" }
];

const CSS = `
.custom-3tb-badge {
    display: inline-block;
    margin-left: 4px;
    vertical-align: middle;
    cursor: pointer;
    position: relative;
}

.custom-3tb-badge img {
    display: block;
    border-radius: 3px;
    transition: transform 0.2s ease;
}

.custom-3tb-badge:hover img {
    transform: scale(1.1);
}

.custom-3tb-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #18191c;
    border: 2px solid #5865F2;
    border-radius: 8px;
    padding: 12px;
    min-width: 280px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    z-index: 99999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: normal;
}

.custom-3tb-badge:hover .custom-3tb-tooltip {
    opacity: 1;
    pointer-events: auto;
}

.custom-3tb-tooltip-title {
    color: #5865F2;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid #5865F2;
    text-align: center;
}

.custom-3tb-plugin-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.custom-3tb-plugin-item {
    background: rgba(88, 101, 242, 0.1);
    border-left: 3px solid #5865F2;
    padding: 8px 10px;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.custom-3tb-plugin-item:hover {
    background: rgba(88, 101, 242, 0.2);
}

.custom-3tb-plugin-name {
    color: #ffffff;
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 3px;
}

.custom-3tb-plugin-desc {
    color: #b9bbbe;
    font-size: 11px;
    line-height: 1.3;
}
`;

export default definePlugin({
    name: "Custom3TbBadge",
    description: "Adds custom badge to profile username",
    authors: [Devs["3Tb"]],
    required: true,
    settings,

    start() {
        const style = document.createElement("style");
        style.id = "custom-3tb-badge-style";
        style.textContent = CSS;
        document.head.appendChild(style);

        this.observer = new MutationObserver(() => {
            this.addBadges();
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        this.addBadges();
    },

    stop() {
        const style = document.getElementById("custom-3tb-badge-style");
        if (style) style.remove();
        
        document.querySelectorAll('.custom-3tb-badge').forEach(badge => badge.remove());
        
        if (this.observer) {
            this.observer.disconnect();
        }
    },

    addBadges() {
        const usernames = document.querySelectorAll('[class*="username-"]');
        
        usernames.forEach(username => {
            if (username.querySelector('.custom-3tb-badge')) return;
            
            const userId = this.findUserId(username);
            if (userId === OWNER_ID) {
                const badge = this.createBadge();
                username.appendChild(badge);
            }
        });
    },

    findUserId(element: Element): string | null {
        let current = element as HTMLElement;
        
        while (current && current !== document.body) {
            if (current.dataset?.userId) return current.dataset.userId;
            
            const ariaLabel = current.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.includes(OWNER_ID)) return OWNER_ID;
            
            current = current.parentElement as HTMLElement;
        }
        
        return null;
    },

    createBadge(): HTMLElement {
        const wrapper = document.createElement("span");
        wrapper.className = "custom-3tb-badge";

        const img = document.createElement("img");
        img.src = settings.store.badgeIcon;
        img.width = settings.store.badgeSize;
        img.height = settings.store.badgeSize;
        img.alt = "3Tb";

        wrapper.appendChild(img);

        if (settings.store.showTooltip) {
            const tooltip = this.createTooltip();
            wrapper.appendChild(tooltip);
        }

        return wrapper;
    },

    createTooltip(): HTMLElement {
        const tooltip = document.createElement("div");
        tooltip.className = "custom-3tb-tooltip";

        const title = document.createElement("div");
        title.className = "custom-3tb-tooltip-title";
        title.textContent = settings.store.tooltipTitle;

        const list = document.createElement("div");
        list.className = "custom-3tb-plugin-list";

        MY_PLUGINS.forEach(plugin => {
            const item = document.createElement("div");
            item.className = "custom-3tb-plugin-item";

            const name = document.createElement("div");
            name.className = "custom-3tb-plugin-name";
            name.textContent = plugin.name;

            const desc = document.createElement("div");
            desc.className = "custom-3tb-plugin-desc";
            desc.textContent = plugin.desc;

            item.appendChild(name);
            item.appendChild(desc);
            list.appendChild(item);
        });

        tooltip.appendChild(title);
        tooltip.appendChild(list);

        return tooltip;
    }
});