class CustomHelper {
    formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    truncateContent = (content: string, maxLength: number = 100) => {
        return content.length > maxLength
            ? content.substring(0, maxLength) + "..."
            : content;
    };

}

export default new CustomHelper();
