/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { React } from "@webpack/common";

const OWNER_ID = "298055455614173184";

const settings = definePluginSettings({
    badgeIcon: {
        type: OptionType.STRING,
        description: "Badge icon URL",
        default: "https://media.discordapp.net/attachments/1407566060822986755/1459584844047847566/1-0da2ffe8207ea1f48097f56939ee6201938cf5af.png?ex=6963cfd0&is=69627e50&hm=9563f90162e6313160840e304b615dbc8fdba8621de47952df4e964773ce0f18&=&format=webp&quality=lossless"
    },
    showTooltip: {
        type: OptionType.BOOLEAN,
        description: "Show plugins list on hover",
        default: true
    }
});

const MY_PLUGINS = [
    { name: "PullUser", desc: "Drag users with you across voice channels" },
    { name: "FollowUser", desc: "Always be in the same VC" },
    { name: "VoiceChannelBlacklist", desc: "Block users from VCs" }
];

function Badge({ user }: { user: any }) {
    const [showTooltip, setShowTooltip] = React.useState(false);

    if (!user?.id || user.id !== OWNER_ID) return null;

    return (
        <div
            style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                marginLeft: "4px",
                cursor: "pointer",
                position: "relative",
                verticalAlign: "middle"
            }}
            onMouseEnter={() => settings.store.showTooltip && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <img
                src={settings.store.badgeIcon}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "3px"
                }}
                alt="3Tb"
            />
            {showTooltip && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#18191c",
                        border: "2px solid #5865F2",
                        borderRadius: "8px",
                        padding: "12px",
                        minWidth: "280px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                        zIndex: 99999,
                        whiteSpace: "normal"
                    }}
                >
                    <div
                        style={{
                            color: "#5865F2",
                            fontWeight: 700,
                            fontSize: "14px",
                            marginBottom: "10px",
                            paddingBottom: "8px",
                            borderBottom: "2px solid #5865F2",
                            textAlign: "center"
                        }}
                    >
                        3Tb's Plugins
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                        }}
                    >
                        {MY_PLUGINS.map((plugin, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "rgba(88, 101, 242, 0.1)",
                                    borderLeft: "3px solid #5865F2",
                                    padding: "8px 10px",
                                    borderRadius: "4px"
                                }}
                            >
                                <div
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: 600,
                                        fontSize: "13px",
                                        marginBottom: "3px"
                                    }}
                                >
                                    {plugin.name}
                                </div>
                                <div
                                    style={{
                                        color: "#b9bbbe",
                                        fontSize: "11px"
                                    }}
                                >
                                    {plugin.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default definePlugin({
    name: "Custom3TbBadge",
    description: "Adds custom badge to profile",
    authors: [Devs["3Tb"]],
    
    patches: [
        {
            find: ".USER_PROFILE_MODAL",
            replacement: {
                match: /(\.profileBadges.+?children):\[(.+?)\]/,
                replace: "$1:[$self.renderBadge(arguments[0]),$2]"
            }
        }
    ],

    settings,

    renderBadge(props: any) {
        return <Badge user={props?.user} />;
    }
});