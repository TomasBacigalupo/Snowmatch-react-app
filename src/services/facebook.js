import ReactPixel from 'react-facebook-pixel';

export const trackViewTeacher = (teacher) => {

    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.track('ViewContent', {
        content_name: teacher?.name + ' ' + teacher?.lastname,
        content_category: 'Teacher',
        content_ids: [teacher?.id],
        content_type: 'product',
        value: teacher?.rates?.length > 0 ? teacher?.rates[0]?.price : 0,
        currency: 'USD',
    })
}

export const searchTeachers = (filters) => {
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.track('Search', {
        search_string: filters.resort,
        contents: {
            resort: filters.resort,
            from: filters.from,
            to: filters.to,
            category: filters.category,
        },
    });
}

export const premiumLesson = () => {
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.track('Premium');
}

export const standardLesson = () => {
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.track('Standard');
}

export const openCatedral = () => {
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.pageView();
}

export const trackExperience = (experience) => {
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, {
        autoConfig: true,
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG"
    });

    ReactPixel.track('ViewContent', {
        content_name: experience?.name,
        content_category: 'Experience',
        content_ids: [experience?.id],
        content_type: 'product',
        value: experience?.price,
        currency: 'USD',
    })
}


